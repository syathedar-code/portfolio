# How to write a blog post

Every post is just one markdown (`.md`) file sitting in a folder. Create the
file, write in it, save — that's the whole publishing step. No admin panel,
no database, no build config to touch.

## 1. Create the file

Go to `src/content/blog/` and add a new file. Name it whatever you want the
URL to be, using hyphens instead of spaces:

```
src/content/blog/my-first-post.md
```

This filename becomes the post's URL: `yoursite.com/blog/my-first-post`.

## 2. Add frontmatter at the very top

Every post needs a small metadata block at the top, between two `---` lines.
This is what powers the title/date/excerpt shown on the `/blog` listing page.

```markdown
---
title: "Your post title here"
date: "2026-07-15"
excerpt: "One sentence describing what this post is about."
---
```

Rules to keep in mind:
- Keep the quotes around each value.
- Use `YYYY-MM-DD` for the date — this is also what controls sort order
  (newest first) on the blog listing page.
- The `excerpt` is the short preview text shown under the title on `/blog` —
  keep it to one line.

## 3. Write the post body below the frontmatter

Everything after the second `---` is your actual article, written in normal
markdown:

```markdown
## A heading

Regular paragraph text goes here. You can make text **bold** or *italic*.

- bullet
- points
- work too

1. numbered
2. lists
3. too
```

## 4. Adding images

1. Put the image file itself in `public/blog-images/` (create that folder if
   it doesn't exist yet).
2. Reference it in your markdown like this:

```markdown
![A short description of the image](/blog-images/your-image.png)
```

The description in the square brackets is the alt text — write a real
description, it matters for accessibility and for anyone whose image doesn't
load.

## 5. Adding "click here" style links

To link out to another website with custom clickable text (not the raw URL
showing), use this format:

```markdown
For more on this, [click here](https://example.com) to read further.
```

That renders as: For more on this, click here to read further — with only
"click here" underlined and clickable, and the actual link hidden behind it.
These links automatically open in a new tab, so people don't lose your site
navigating away.

## 6. Full example post

```markdown
---
title: "Hardening a LAMP stack with SafeLine WAF"
date: "2026-07-15"
excerpt: "Notes from standing up SSL/TLS, firewall rules, and a WAF from scratch."
---

## Why I built this

I wanted to understand both sides of web security — building the app and
also trying to break it. This post walks through the lab setup.

![SafeLine dashboard showing blocked SQL injection attempts](/blog-images/safeline-dashboard.png)

## The setup

I used Kali Linux as the attack box and Ubuntu as the target server running
DVWA behind Apache and MySQL.

For background on how the WAF itself works, [click here](https://safepoint.cloud/products/safeline)
to see their documentation.

## What I found

- SQL injection was blocked once the WAF was set to "Block" mode
- Logs captured full attack payloads for review
- Response time overhead was minimal

That's it — same lab from my resume, written up properly.
```

## 7. Publishing it

Save the file. That's the entire step — no separate "publish" action.

- In local dev (`npm run dev`), it shows up on `/blog` immediately.
- For the live site, commit the new `.md` file (and any images) to your
  repo, push, and redeploy as normal (however you're hosting — Vercel,
  Netlify, GitHub Pages, etc. will pick up the new file on the next build).

## Quick checklist before you save a new post

- [ ] File is in `src/content/blog/`, named with hyphens, ends in `.md`
- [ ] Frontmatter has `title`, `date`, and `excerpt`, each in quotes
- [ ] Any images are in `public/blog-images/` and referenced with a leading `/`
- [ ] External links use `[click here](url)` — not raw pasted URLs
- [ ] Date is in `YYYY-MM-DD` format
