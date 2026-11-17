import fs from "node:fs/promises";
import path from "node:path";
import { isEditor, readSaved, writeSaved } from "./_store.js";

async function defaults() {
  return JSON.parse(await fs.readFile(path.join(process.cwd(), "content.default.json"), "utf8"));
}

function valid(c) {
  return c && typeof c === "object" && c.site && typeof c.site === "object" && Array.isArray(c.projects)
    && c.projects.every((p) => p && typeof p.slug === "string" && typeof p.title === "string");
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const editor = isEditor(req);
      let content = null, storageError = false;
      try { content = await readSaved(); } catch { storageError = true; }
      if (!content) content = await defaults();
      if (!editor) content = { ...content, projects: content.projects.filter((p) => p.published !== false) };
      return res.status(200).json({ content, editor, storageError });
    }
    if (req.method === "PUT") {
      if (!isEditor(req)) return res.status(401).json({ error: "Wrong edit password" });
      const content = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!valid(content)) return res.status(400).json({ error: "That content is missing required parts, so it was not saved" });
      await writeSaved(content);
      return res.status(200).json({ ok: true });
    }
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Saving is unavailable right now. Your changes are still on this screen; try again in a minute." });
  }
}
