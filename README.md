# Cameron Wansing projects page

A small static site (index.html, styles.css, app.js) with three server functions in `api/`
that store edits and uploaded images in Vercel Blob.

- Starting content: `content.default.json`. Once you save from edit mode, the saved version is used instead.
- Edit mode: open the site, choose "Edit this page" in the footer, enter the edit password
  (the `EDIT_PASSWORD` setting in Vercel).
- This branch (`projects-page`) is deployed by the Vercel project `cameron-wansing-projects`.
