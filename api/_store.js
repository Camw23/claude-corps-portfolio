// Storage for the page's content and uploaded images.
// On Vercel this is a Blob store. Without a Blob token (local preview) it falls back to a folder on disk.
import { timingSafeEqual, randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const localDir = path.join(process.cwd(), ".data");
const KEEP_VERSIONS = 25;

export function isEditor(req) {
  const expected = process.env.EDIT_PASSWORD || "";
  const given = String(req.headers["x-edit-key"] || "");
  if (!expected || !given) return false;
  const a = Buffer.from(expected), b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function readSaved() {
  if (hasBlob()) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "content/" });
    if (!blobs.length) return null;
    const latest = blobs.sort((x, y) => new Date(y.uploadedAt) - new Date(x.uploadedAt))[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) throw new Error("Could not read saved content");
    return res.json();
  }
  try { return JSON.parse(await fs.readFile(path.join(localDir, "content.json"), "utf8")); }
  catch { return null; }
}

export async function writeSaved(content) {
  const body = JSON.stringify(content);
  if (hasBlob()) {
    const { put, list, del } = await import("@vercel/blob");
    await put(`content/${Date.now()}.json`, body, { access: "public", contentType: "application/json", addRandomSuffix: true });
    const { blobs } = await list({ prefix: "content/" });
    const old = blobs.sort((x, y) => new Date(y.uploadedAt) - new Date(x.uploadedAt)).slice(KEEP_VERSIONS);
    if (old.length) await del(old.map((b) => b.url));
    return;
  }
  await fs.mkdir(localDir, { recursive: true });
  await fs.writeFile(path.join(localDir, "content.json"), body);
}

export async function saveImage(buffer, contentType) {
  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[contentType];
  if (!ext) throw new Error("Only JPEG, PNG or WebP images can be uploaded");
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  if (hasBlob()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`img/${name}`, buffer, { access: "public", contentType });
    return blob.url;
  }
  await fs.mkdir(path.join(localDir, "img"), { recursive: true });
  await fs.writeFile(path.join(localDir, "img", name), buffer);
  return `/.data/img/${name}`;
}
