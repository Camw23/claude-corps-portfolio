// Local preview only: serves the static files and runs the /api handlers. Not deployed.
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const root = process.cwd(); const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" };
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname.startsWith("/api/")) {
    const mod = await import(path.join(root, url.pathname + ".js"));
    const chunks = []; for await (const c of req) chunks.push(c); const buf = Buffer.concat(chunks);
    const ct = req.headers["content-type"] || "";
    req.body = ct.includes("json") && buf.length ? JSON.parse(buf) : buf;
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (o) => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(o)); };
    return mod.default(req, res);
  }
  let file = path.join(root, url.pathname === "/" ? "index.html" : url.pathname);
  if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, "index.html");
  res.setHeader("content-type", types[path.extname(file)] || "application/octet-stream"); fs.createReadStream(file).pipe(res);
}).listen(process.env.PORT || 4173);
