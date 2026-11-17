import { isEditor } from "./_store.js";
export default function handler(req, res) {
  if (!process.env.EDIT_PASSWORD) return res.status(503).json({ error: "Editing is not set up on this site yet" });
  return isEditor(req) ? res.status(200).json({ ok: true }) : res.status(401).json({ error: "Wrong edit password" });
}
