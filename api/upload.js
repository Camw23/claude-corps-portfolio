import { isEditor, saveImage } from "./_store.js";

async function rawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
    if (!isEditor(req)) return res.status(401).json({ error: "Wrong edit password" });
    const type = String(req.headers["content-type"] || "").split(";")[0].trim();
    const buffer = await rawBody(req);
    if (!buffer.length) return res.status(400).json({ error: "The image was empty" });
    if (buffer.length > 4 * 1024 * 1024) return res.status(413).json({ error: "That image is over 4 MB. Use a smaller one." });
    const url = await saveImage(buffer, type);
    return res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message || "The image could not be uploaded" });
  }
}
