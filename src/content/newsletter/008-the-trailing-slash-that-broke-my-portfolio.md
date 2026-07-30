---
title: "The Trailing Slash That Broke My Portfolio"
date: "2026-07-30"
issue: "#008"
excerpt: "How a single missing character caused inconsistent routing across devices, and what I learned about Cloudflare Pages' SPA behavior."
---

# The Trailing Slash That Broke My Portfolio

Last week I noticed something strange.

My portfolio links worked perfectly on my phone.

But on my laptop, `/blog` and `/newsletter` redirected to the homepage.

Add a trailing slash — `/blog/`, `/newsletter/` — and everything worked fine.

Same links. Same code.

Different behavior across devices.

Here's what happened, and how I fixed it.

---

## The Symptom

I built my portfolio as a React SPA with Vite, deployed on Cloudflare Pages.

Navigation behaved like this:

| URL | Phone | Laptop |
| --- | :---: | :---: |
| `/blog` | ✅ Blog loads | ❌ Redirects to home |
| `/blog/` | ✅ Blog loads | ✅ Blog loads |
| `/newsletter` | ✅ Newsletter loads | ❌ Redirects to home |
| `/newsletter/` | ✅ Newsletter loads | ✅ Newsletter loads |
| `/blog/some-post` | ✅ Post loads | ✅ Post loads |

Nested routes worked.

Top-level routes didn't—unless they had a trailing slash.

---

## The Root Cause

Cloudflare Pages has **opinionated trailing slash behavior**.

When a request comes in for:

```text
/blog
```

Cloudflare checks:

1. Is there a `blog.html` file?
2. Is there a `blog/index.html` file?
3. If neither exists and no static file matches, fall back to the SPA entry.

The interesting part is that Cloudflare also applies **default trailing-slash normalization** for directory-like paths.

The interaction between SPA fallback and trailing slash normalization isn't always obvious.

My phone and laptop were hitting different Cloudflare edge behavior, producing inconsistent results despite running the exact same application.

---

## Attempt 1: `_redirects`

My first idea was adding a `_redirects` file.

```text
/*    /index.html    200
```

The intention was simple:

> Serve `index.html` for every unmatched route without issuing a redirect.

Unfortunately, Cloudflare Pages rejected it with:

> "Infinite loop detected in this rule and has been ignored."

Cloudflare internally normalizes requests in a way that causes this catch-all rule to be considered recursive.

So although `200` represents a rewrite—not a redirect—the validator still flags it as a potential loop.

---

## The Fix: `200.html`

Cloudflare Pages supports a native SPA fallback.

If a file named:

```text
200.html
```

exists in the build output, Cloudflare automatically serves it for unmatched routes.

No routing configuration.

No `_redirects`.

No rewrite rules.

To generate it automatically, I added a small Vite plugin:

```ts
import { copyFileSync } from "fs";
import { resolve } from "path";

{
  name: "copy-200-html",
  closeBundle() {
    copyFileSync(
      resolve(__dirname, "dist/index.html"),
      resolve(__dirname, "dist/200.html")
    );
  },
}
```

Now Cloudflare serves `200.html` for:

- `/blog`
- `/newsletter`
- Unknown routes
- Deep links

React Router receives the original URL and renders the correct page.

---

## Updating React Router

I also chose to explicitly support both URL formats.

```tsx
<Route path="/blog" element={<Blog />} />
<Route path="/blog/" element={<Blog />} />

<Route path="/newsletter" element={<Newsletter />} />
<Route path="/newsletter/" element={<Newsletter />} />
```

This guarantees the application behaves consistently regardless of which version of the URL a visitor opens.

---

## One More Bug

While debugging the routing issue, I discovered another small mistake.

My `useIntroState` hook only considered:

```text
/blog/
/newsletter/
```

to be valid routes.

That meant:

```text
/blog
```

was incorrectly treated as an invalid path, causing the intro animation to skip entirely.

Supporting both route formats fixed that issue as well.

---

## What I Learned

A few takeaways from the experience:

- Platform behavior matters just as much as application code.
- Static hosting providers all implement SPA routing differently.
- Testing on multiple devices can expose behavior hidden by cache or edge-node differences.
- Trailing slashes aren't just cosmetic—they affect routing behavior.
- Supporting both URL variants makes navigation more resilient.

---

## The Result

| URL | Before | After |
| --- | --- | --- |
| `/blog` | ❌ Redirected to home | ✅ Blog loads |
| `/blog/` | ✅ Blog loads | ✅ Blog loads |
| `/newsletter` | ❌ Redirected to home | ✅ Newsletter loads |
| `/newsletter/` | ✅ Newsletter loads | ✅ Newsletter loads |

Everything now behaves consistently across devices.

No unexpected redirects.

No routing edge cases.

---

## Final Thoughts

This bug came down to a single missing character:

```text
/
```

It looked insignificant.

But it completely changed how requests were handled before React even loaded.

That's one of the biggest lessons I've learned while building this portfolio:

Small implementation details often reveal how much work your hosting platform is doing behind the scenes.

Understanding those layers makes debugging far easier than memorizing framework APIs.

---

**That's Issue #007.**

Short, practical, and one more lesson from building in production.

— **Syed Athar**