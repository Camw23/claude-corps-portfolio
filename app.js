/* Cameron Wansing projects page.
   Content comes from /api/content (saved edits) and falls back to content.default.json.
   Edit mode lets the owner change every piece of text, image, list and link, then save. */
(() => {
  const app = document.getElementById("app");
  const state = { content: null, saved: "", editing: false, key: sessionStorage.getItem("editKey") || "", dirty: false, notice: "" };

  /* ---------- small helpers ---------- */
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === false || v == null) continue;
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, "");
      else el.setAttribute(k, v);
    }
    for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid);
    return el;
  };
  const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), state.content);
  const set = (path, value) => {
    const keys = path.split("."); const last = keys.pop();
    keys.reduce((o, k) => o[k], state.content)[last] = value; markDirty();
  };
  const safeUrl = (u) => {
    u = String(u || "").trim();
    if (!u) return "";
    if (/^(https?:|mailto:)/i.test(u)) return u;
    if (/^[\w.-]+@[\w.-]+\.\w+$/.test(u)) return "mailto:" + u;
    if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(u)) return "https://" + u;
    return "";
  };
  const safeImg = (u) => {
    u = String(u || "").trim();
    return /^(https:\/\/|\/?img\/|\/\.data\/)/.test(u) ? (u.startsWith("img/") ? "/" + u : u) : "";
  };
  const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
  const markDirty = () => { state.dirty = JSON.stringify(state.content) !== state.saved; updateBar(); };

  /* ---------- editable building blocks ---------- */
  // Text bound to a path in the content. In edit mode it is typed into directly.
  function text(tag, path, { cls = "", placeholder = "", multiline = false } = {}) {
    const value = get(path) || "";
    if (!state.editing) {
      if (!value.trim()) return null;
      if (multiline) return h("div", { class: cls }, value.split(/\n\s*\n/).map((p) => h("p", {}, p.trim())));
      return h(tag, { class: cls }, value);
    }
    const el = h(multiline ? "div" : tag, {
      class: `${cls} editable${multiline ? " multiline" : ""}`, contenteditable: "plaintext-only", spellcheck: "true",
      "data-placeholder": placeholder, role: "textbox", "aria-label": placeholder, "aria-multiline": multiline ? "true" : "false",
      oninput: () => set(path, el.innerText.replace(/ /g, " ").replace(/\n$/, "")),
      onkeydown: (e) => { if (e.key === "Enter" && !multiline) e.preventDefault(); },
      onclick: (e) => e.preventDefault(),
    }, value);
    if (el.contentEditable !== "plaintext-only") el.contentEditable = "true";
    return el;
  }
  const tool = (label, onclick, cls = "") => h("button", { type: "button", class: `tool ${cls}`, onclick: (e) => { e.preventDefault(); e.stopPropagation(); onclick(e); } }, label);
  function listTools(arrPath, i) {
    const arr = get(arrPath);
    const move = (d) => { const j = i + d; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; markDirty(); render(); };
    return h("span", { class: "tools" },
      tool("Move up", () => move(-1)), tool("Move down", () => move(1)),
      tool("Remove", () => { arr.splice(i, 1); markDirty(); render(); }, "danger"));
  }
  const field = (label, path, placeholder = "") => {
    const input = h("input", { type: "text", value: get(path) || "", placeholder, oninput: () => set(path, input.value) });
    return h("label", { class: "field" }, h("span", {}, label), input);
  };

  /* ---------- image upload ---------- */
  async function shrink(file) {
    if (file.size < 900 * 1024 && /image\/(png|jpeg|webp)/.test(file.type)) return file;
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2200 / bitmap.width);
    const canvas = Object.assign(document.createElement("canvas"), { width: Math.round(bitmap.width * scale), height: Math.round(bitmap.height * scale) });
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return new Promise((ok) => canvas.toBlob((b) => ok(b), "image/jpeg", 0.88));
  }
  async function upload(file) {
    const blob = await shrink(file);
    const res = await fetch("/api/upload", { method: "POST", headers: { "content-type": blob.type, "x-edit-key": state.key }, body: blob });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(out.error || "The image could not be uploaded");
    return out.url;
  }
  async function addFiles(files, onUrls) {
    const images = [...files].filter((f) => /^image\//.test(f.type));
    if (!images.length) { flash("Choose a PNG, JPEG or WebP image.", true); return; }
    try {
      flash("Uploading…");
      const urls = [];
      for (const f of images) urls.push(await upload(f));
      onUrls(urls); markDirty(); render(); flash("Image added. Save changes to publish it.");
    } catch (err) { flash(err.message, true); }
  }
  function pickImages(multiple, onUrls) {
    const input = h("input", { type: "file", accept: "image/png,image/jpeg,image/webp", multiple });
    input.addEventListener("change", () => addFiles(input.files, onUrls));
    input.click();
  }

  /* ---------- pages ---------- */
  function header() {
    const s = state.content.site;
    const links = [
      safeUrl(s.email) && h("a", { href: safeUrl(s.email) }, "Email"),
      safeUrl(s.linkedin) && h("a", { href: safeUrl(s.linkedin), rel: "noopener" }, "LinkedIn"),
      safeUrl(s.resumeUrl) && h("a", { href: safeUrl(s.resumeUrl), rel: "noopener" }, "Résumé"),
    ];
    return h("header", { class: "top" },
      h("a", { class: "brand", href: "#/" }, flag(), state.editing ? text("span", "site.name", { placeholder: "Your name" }) : h("span", {}, s.name)),
      h("nav", { "aria-label": "Contact" }, links));
  }
  const flag = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 20 24"); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("class", "flag");
    svg.innerHTML = '<path d="M5 22V2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path class="pennant" d="M6 3l11 4.2L6 11.5z"/>';
    return svg;
  };

  function home() {
    const c = state.content, s = c.site;
    document.title = `${s.name} | Projects`;
    const rows = c.projects.map((p, i) => {
      const cover = safeImg(p.cover);
      const row = h("a", { class: `project${p.published === false ? " draft" : ""}`, href: `#/p/${p.slug}` },
        h("div", { class: "thumb" }, cover ? h("img", { src: cover, alt: "", loading: "lazy" }) : h("span", { class: "thumb-empty", "aria-hidden": "true" }, (p.title || "?").slice(0, 1))),
        h("div", { class: "project-body" },
          h("p", { class: "meta" }, [p.kind, p.year].filter(Boolean).join(", "), p.published === false && h("span", { class: "badge" }, "Draft, hidden from visitors")),
          h("h3", {}, p.title || "Untitled project"),
          p.oneLiner ? h("p", { class: "one" }, p.oneLiner) : state.editing && h("p", { class: "one hint" }, "Open this project to write its description."),
          h("span", { class: "more" }, "View project")));
      return h("li", {}, row, state.editing && listTools("projects", i));
    });
    return h("div", { class: "page" }, header(),
      h("main", { id: "main" },
        h("section", { class: "hero" },
          text("h1", "site.headline", { placeholder: "Your headline" }),
          text("p", "site.intro", { cls: "lede", placeholder: "A short introduction", multiline: true })),
        h("section", { class: "projects", "aria-labelledby": "projects-h" },
          text("h2", "site.projectsHeading", { placeholder: "Section heading" }) || h("h2", { class: "sr" }, "Projects"),
          h("ul", { class: "project-list" }, rows),
          state.editing && tool("Add project", addProject, "add")),
        offClock(),
        state.editing && h("section", { class: "settings" }, h("h2", {}, "Contact links"),
          h("p", { class: "hint" }, "Leave a box empty to hide that link."),
          field("Email address", "site.email", "you@example.com"), field("LinkedIn link", "site.linkedin", "https://www.linkedin.com/in/…"), field("Résumé link", "site.resumeUrl", "https://…"))),
      footer());
  }
  function offClock() {
    const items = state.content.site.offClock || (state.content.site.offClock = []);
    if (!state.editing && !items.length) return null;
    return h("section", { class: "offclock" },
      text("h2", "site.offClockHeading", { placeholder: "Section heading" }),
      h("ul", {}, items.map((_, i) => h("li", {}, flag(), text("span", `site.offClock.${i}`, { placeholder: "Something you do" }), state.editing && listTools("site.offClock", i)))),
      state.editing && tool("Add item", () => { items.push(""); markDirty(); render(); }, "add"));
  }
  function footer() {
    return h("footer", { class: "foot" }, text("p", "site.footer", { placeholder: "Footer line" }),
      !state.editing && h("button", { type: "button", class: "edit-link", onclick: startEditing }, "Edit this page"));
  }
  function addProject() {
    const slugs = new Set(state.content.projects.map((p) => p.slug)); let slug = "new-project", n = 2;
    while (slugs.has(slug)) slug = `new-project-${n++}`;
    state.content.projects.push({ slug, published: false, title: "New project", kind: "", year: String(new Date().getFullYear()), builtFor: "", role: "", oneLiner: "", cover: "", summary: "", why: "", process: [], learned: "", stack: [], status: "", screenshots: [], links: [] });
    markDirty(); location.hash = `#/p/${slug}`;
  }

  function project(slug) {
    const c = state.content, i = c.projects.findIndex((p) => p.slug === slug);
    if (i < 0) return h("div", { class: "page" }, header(), h("main", { id: "main", class: "missing" }, h("h1", {}, "That project isn't here"), h("p", {}, h("a", { href: "#/" }, "See all projects"))), footer());
    const p = c.projects[i], base = `projects.${i}`;
    document.title = `${p.title} | ${c.site.name}`;
    const section = (title, body) => body && h("section", { class: "block" }, h("h2", {}, title), body);
    const fact = (label, path, ph) => { const v = text("dd", path, { placeholder: ph }); return v && h("div", {}, h("dt", {}, label), v); };

    // screenshots
    const shots = p.screenshots || (p.screenshots = []);
    const figures = shots.map((s, j) => {
      const src = safeImg(s.src);
      return h("figure", { class: j === 0 ? "shot lead" : "shot" },
        src && h("button", { type: "button", class: "zoom", "aria-label": `Enlarge screenshot: ${s.caption || p.title}`, onclick: () => lightbox(src, s.caption) }, h("img", { src, alt: s.caption || `${p.title} screenshot`, loading: j ? "lazy" : "eager" })),
        text("figcaption", `${base}.screenshots.${j}.caption`, { placeholder: "Caption for this screenshot" }),
        state.editing && h("span", { class: "tools" }, tool("Use as cover", () => { p.cover = s.src; markDirty(); flash("Cover image set."); }), listTools(`${base}.screenshots`, j)));
    });
    const gallery = (figures.length || state.editing) && h("section", { class: "gallery", "aria-label": "Screenshots" }, figures,
      state.editing && (() => {
        const onUrls = (urls) => { urls.forEach((u) => shots.push({ src: u, caption: "" })); if (!p.cover) p.cover = urls[0]; };
        const input = h("input", { type: "file", id: "shot-input", accept: "image/png,image/jpeg,image/webp", multiple: true });
        input.addEventListener("change", () => addFiles(input.files, onUrls));
        const zone = h("div", { class: "dropzone" },
          h("p", {}, shots.length ? "Add more screenshots of the app." : "No screenshots yet. Add a few that show the app in use."),
          h("label", { for: "shot-input", class: "tool add" }, "Choose screenshots"), input,
          h("p", { class: "hint" }, "Or drag image files onto this box."));
        zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("over"); });
        zone.addEventListener("dragleave", () => zone.classList.remove("over"));
        zone.addEventListener("drop", (e) => { e.preventDefault(); zone.classList.remove("over"); addFiles(e.dataTransfer.files, onUrls); });
        return zone;
      })());

    // process
    const steps = p.process || (p.process = []);
    const processList = (steps.length || state.editing) && h("div", {},
      h("ol", { class: "steps" }, steps.map((_, j) => h("li", {},
        text("h3", `${base}.process.${j}.title`, { placeholder: "Step name" }),
        text("p", `${base}.process.${j}.text`, { placeholder: "What you did in this step", multiline: state.editing }),
        state.editing && listTools(`${base}.process`, j)))),
      state.editing && tool("Add step", () => { steps.push({ title: "", text: "" }); markDirty(); render(); }, "add"));

    // stack
    const stack = p.stack || (p.stack = []);
    const stackList = (stack.length || state.editing) && h("div", {},
      h("ul", { class: "stack" }, stack.map((_, j) => h("li", {}, text("span", `${base}.stack.${j}`, { placeholder: "Tool" }), state.editing && tool("Remove", () => { stack.splice(j, 1); markDirty(); render(); }, "danger")))),
      state.editing && tool("Add tool", () => { stack.push(""); markDirty(); render(); }, "add"));

    // links
    const links = p.links || (p.links = []);
    const linkArea = state.editing
      ? h("section", { class: "block" }, h("h2", {}, "Links"), h("p", { class: "hint" }, "Buttons shown at the end of the page, for a live site or demo."),
          links.map((_, j) => h("div", { class: "link-edit" }, field("Button text", `${base}.links.${j}.label`, "Open the live site"), field("Web address", `${base}.links.${j}.url`, "https://…"), tool("Remove", () => { links.splice(j, 1); markDirty(); render(); }, "danger"))),
          tool("Add link", () => { links.push({ label: "", url: "" }); markDirty(); render(); }, "add"))
      : links.filter((l) => safeUrl(l.url) && l.label).length > 0 && h("section", { class: "block cta" }, h("h2", {}, "See it"),
          h("p", {}, links.filter((l) => safeUrl(l.url) && l.label).map((l) => h("a", { class: "button", href: safeUrl(l.url), rel: "noopener", target: "_blank" }, l.label, h("span", { class: "sr" }, " (opens in a new tab)")))));

    const next = c.projects.filter((q) => q.slug !== slug && (state.editing || q.published !== false));
    const after = next.length ? (c.projects.slice(i + 1).find((q) => next.includes(q)) || next[0]) : null;

    const projectSettings = state.editing && h("section", { class: "settings" }, h("h2", {}, "Project settings"),
      h("label", { class: "check" }, (() => { const cb = h("input", { type: "checkbox", checked: p.published !== false }); cb.addEventListener("change", () => { p.published = cb.checked; markDirty(); render(); }); return cb; })(), h("span", {}, "Show this project to visitors")),
      (() => { const input = h("input", { type: "text", value: p.slug }); input.addEventListener("change", () => { const s = slugify(input.value); if (c.projects.some((q, k) => k !== i && q.slug === s)) { flash("Another project already uses that address.", true); input.value = p.slug; return; } p.slug = s; markDirty(); location.hash = `#/p/${s}`; }); return h("label", { class: "field" }, h("span", {}, "Page address (after #/p/)"), input); })(),
      h("div", { class: "cover-edit" }, h("span", {}, "Cover image on the home page: ", safeImg(p.cover) ? "set" : "none"),
        tool(safeImg(p.cover) ? "Replace cover" : "Upload cover", () => pickImages(false, ([u]) => { p.cover = u; })), safeImg(p.cover) && tool("Remove cover", () => { p.cover = ""; markDirty(); render(); }, "danger")),
      (() => { let armed = false; const b = tool("Delete this project", () => { if (!armed) { armed = true; b.textContent = "Click again to delete it"; return; } c.projects.splice(i, 1); markDirty(); location.hash = "#/"; }, "danger"); return b; })());

    return h("div", { class: "page" }, header(),
      h("main", { id: "main", class: "detail" },
        h("p", { class: "back" }, h("a", { href: "#/" }, "All projects")),
        p.published === false && h("p", { class: "badge" }, "Draft, hidden from visitors"),
        h("div", { class: "detail-head" },
          text("p", `${base}.kind`, { cls: "meta", placeholder: "What kind of thing it is" }),
          text("h1", `${base}.title`, { placeholder: "Project name" }),
          text("p", `${base}.oneLiner`, { cls: "lede", placeholder: "One sentence on what it does" })),
        h("dl", { class: "facts" }, fact("Built for", `${base}.builtFor`, "Who uses it"), fact("My role", `${base}.role`, "What you did"), fact("Year", `${base}.year`, "Year"), fact("Status", `${base}.status`, "Where it stands today")),
        gallery,
        h("div", { class: "prose" },
          section("What it is", text("p", `${base}.summary`, { placeholder: "Describe what the app does and who it is for", multiline: true })),
          section("Why I built it", text("p", `${base}.why`, { placeholder: "The problem that started it", multiline: true })),
          section("How I built it", processList),
          section("What I learned", text("p", `${base}.learned`, { placeholder: "What you took away from it", multiline: true })),
          section("Built with", stackList),
          linkArea),
        projectSettings,
        after && h("p", { class: "next" }, h("span", {}, "Next project"), h("a", { href: `#/p/${after.slug}` }, after.title))),
      footer());
  }

  /* ---------- lightbox ---------- */
  function lightbox(src, caption) {
    const dlg = h("dialog", { class: "lightbox", "aria-label": caption || "Screenshot" },
      h("img", { src, alt: caption || "" }), caption && h("p", {}, caption),
      h("form", { method: "dialog" }, h("button", { class: "button quiet" }, "Close")));
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", () => dlg.remove());
    document.body.append(dlg); dlg.showModal();
  }

  /* ---------- edit mode ---------- */
  let bar, toast;
  function updateBar() {
    if (!state.editing) { bar?.remove(); bar = null; document.body.classList.remove("editing"); return; }
    document.body.classList.add("editing");
    if (!bar) {
      bar = h("div", { class: "editbar", role: "region", "aria-label": "Editing" },
        h("p", { class: "editbar-status" }),
        h("div", {}, tool("Discard changes", discard, "discard"), tool("Stop editing", stopEditing, "stop"), tool("Save changes", save, "save primary")));
      document.body.append(bar);
    }
    bar.querySelector(".editbar-status").textContent = state.notice || (state.dirty ? "You have unsaved changes. Visitors see them after you save." : "Editing. Click any text to change it.");
    bar.querySelector(".save").disabled = !state.dirty; bar.querySelector(".discard").disabled = !state.dirty;
  }
  function flash(message, isError = false) {
    toast?.remove();
    toast = h("p", { class: `toast${isError ? " error" : ""}`, role: isError ? "alert" : "status" }, message);
    document.body.append(toast); const t = toast; setTimeout(() => t.remove(), isError ? 7000 : 3500);
  }
  async function load() {
    try {
      const res = await fetch("/api/content", { headers: state.key ? { "x-edit-key": state.key } : {} });
      if (!res.ok) throw new Error();
      const out = await res.json(); state.content = out.content;
      if (state.key && !out.editor) { state.key = ""; sessionStorage.removeItem("editKey"); }
    } catch {
      const res = await fetch("/content.default.json"); const c = await res.json();
      state.content = { ...c, projects: c.projects.filter((p) => p.published !== false) };
    }
    state.saved = JSON.stringify(state.content); state.dirty = false;
  }
  function startEditing() {
    const input = h("input", { type: "password", autocomplete: "current-password", required: true, id: "edit-pw" });
    const error = h("p", { class: "form-error", role: "alert" });
    const form = h("form", {}, h("h2", {}, "Edit this page"), h("label", { for: "edit-pw" }, "Edit password"), input, error,
      h("div", { class: "dialog-actions" }, h("button", { type: "button", class: "button quiet", onclick: () => dlg.close() }, "Cancel"), h("button", { class: "button" }, "Start editing")));
    const dlg = h("dialog", { class: "login" }, form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); error.textContent = "";
      try {
        const res = await fetch("/api/auth", { method: "POST", headers: { "x-edit-key": input.value } });
        if (!res.ok) { error.textContent = (await res.json().catch(() => ({}))).error || "That password didn't work."; return; }
        state.key = input.value; sessionStorage.setItem("editKey", state.key);
        await load(); state.editing = true; dlg.close(); render();
      } catch { error.textContent = "Couldn't reach the site. Check your connection and try again."; }
    });
    dlg.addEventListener("close", () => dlg.remove());
    document.body.append(dlg); dlg.showModal();
  }
  async function save() {
    state.notice = "Saving…"; updateBar();
    try {
      const res = await fetch("/api/content", { method: "PUT", headers: { "content-type": "application/json", "x-edit-key": state.key }, body: JSON.stringify(state.content) });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || "The changes could not be saved.");
      state.saved = JSON.stringify(state.content); state.dirty = false; state.notice = ""; updateBar(); flash("Saved. Visitors now see this version.");
    } catch (err) { state.notice = ""; updateBar(); flash(err.message, true); }
  }
  function discard() { state.content = JSON.parse(state.saved); state.dirty = false; render(); flash("Changes discarded."); }
  async function stopEditing() {
    if (state.dirty) { flash("Save or discard your changes first.", true); return; }
    state.editing = false; render();
  }
  window.addEventListener("beforeunload", (e) => { if (state.dirty) { e.preventDefault(); e.returnValue = ""; } });

  /* ---------- routing ---------- */
  function render() {
    const m = location.hash.match(/^#\/p\/([\w-]+)/);
    const scroll = window.scrollY;
    app.replaceChildren(m ? project(m[1]) : home());
    updateBar(); window.scrollTo(0, scroll);
  }
  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); document.getElementById("main")?.focus?.(); });
  load().then(() => { render(); if (location.hash === "#edit") { history.replaceState(null, "", "#/"); startEditing(); } })
    .catch(() => { app.replaceChildren(h("p", { class: "loading" }, "This page couldn't load. Refresh to try again.")); });
})();
