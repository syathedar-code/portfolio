---
title: "Everything I Learned Deploying a React SPA to Cloudflare Pages"
date: "2026-07-30"
excerpt: "A deployment case study covering React Router deep links, Cloudflare Pages routing quirks, static 404 conflicts, forced rewrites, responsive 3D UI, and navigation UX."
---

# Everything I Learned Deploying a React SPA to Cloudflare Pages

Deploying a React application is usually the easy part.

Making it behave like a polished, production-ready website?

That's where things get interesting.

I recently deployed my portfolio to **Cloudflare Pages**, built with **Vite**, **React**, and **React Router**. Everything worked perfectly during development, but production immediately exposed problems I never encountered locally.

Refreshing a blog post returned a 404.

Deep links didn't work.

My animated intro played at the wrong times.

Even my custom 404 page became the cause of another routing issue.

And just when I thought everything was finally fixed, Cloudflare introduced one last surprise: automatic trailing-slash redirects.

What started as a simple deployment turned into a deep dive into how Cloudflare Pages actually serves Single Page Applications (SPAs).

Here's everything I learned.

---

## The First Real Fix

After experimenting with different approaches, I stopped trying to rewrite every request and instead focused only on the routes my application actually owns.

```text
/blog          /index.html 200
/blog/*        /index.html 200

/newsletter    /index.html 200
/newsletter/*  /index.html 200
```

This tells Cloudflare Pages to serve `index.html` whenever a request matches one of those routes, allowing React Router to take over once the application loads.

Combined with removing the static `404.html`, the results were immediate.

- Refreshing blog posts worked.
- Direct links opened correctly.
- Bookmarked URLs no longer returned 404s.
- React Router finally controlled navigation again.

For the first time, the deployment behaved exactly as I expected.

Or so I thought.

---

## One Last Cloudflare Surprise

Everything seemed perfect.

Until I noticed something strange.

Opening:

```text
/newsletter
```

sometimes became:

```text
/
```

without my application doing anything.

At first, I assumed React Router was redirecting.

It wasn't.

My application never issued a redirect.

The behavior came from **Cloudflare Pages** itself.

Cloudflare's `_redirects` engine automatically normalizes URLs by adding or removing trailing slashes before the request ever reaches your application. This only happens when you use explicit `_redirects` rules — the built-in SPA fallback doesn't do this.

This was particularly confusing because client-side navigation behaved perfectly. The unexpected redirect only appeared when the browser made a direct request to Cloudflare, making it look like a React Router problem when it was actually happening at the hosting layer.

That meant React Router never even saw the original URL.

---

## The Real Root Cause

Here's what I discovered: **Cloudflare Pages has two completely different routing systems**.

| System | Trigger | Trailing-Slash Behavior |
|--------|---------|------------------------|
| **Built-in SPA fallback** | No `404.html`, no `_redirects` | No normalization — serves `index.html` as-is for all unmatched routes |
| **`_redirects` engine** | `_redirects` file exists | Trailing-slash normalization enabled — sends 308 redirects for exact path matches |

By adding `_redirects` to fix the `404.html` problem, I had **unintentionally switched from the lenient system to the strict system**. The strict system has trailing-slash normalization that breaks `/newsletter` and `/blog` (without trailing slashes).

I tried forcing rewrites with the `!` modifier:

```text
/blog             /index.html   200!
/blog/            /index.html   200!
/blog/*           /index.html   200!

/newsletter       /index.html   200!
/newsletter/      /index.html   200!
/newsletter/*     /index.html   200!
```

But Cloudflare still applied the 308 redirect **before** evaluating `_redirects` for exact path matches. The `!` flag couldn't override this.

---

## The Nuclear Option: Remove Everything

After exhausting every configuration option, I realized the simplest solution was also the most counterintuitive:

**Delete `_redirects` entirely.**

With no `404.html` and no `_redirects`, Cloudflare Pages falls back to its **built-in SPA fallback**:

- All unmatched routes → `index.html`
- No trailing-slash normalization
- No 308 redirects
- React Router handles everything

This is how my portfolio worked originally, before I added the custom 404 page. The only reason I needed `_redirects` was because `404.html` disabled the built-in fallback. Once I moved the 404 page into React Router (`NotFound.tsx`), I no longer needed any routing configuration files at all.

---

## Bringing the 404 Page Back

With routing finally behaving correctly, I could bring back one of my favorite parts of the portfolio: the custom animated 404 page.

Earlier in the debugging process, deleting `public/404.html` was necessary because Cloudflare always served that file before React Router had a chance to render.

Removing the file fixed the routing issue, but it also meant losing the custom experience I'd built.

The solution wasn't to recreate `404.html`.

It was to let **React Router** own it instead.

Instead of placing a static HTML file inside `public/`, I moved the page into the application itself.

```text
public/
└── 404.html
```

became

```text
src/pages/
└── NotFound.tsx
```

React Router now handles every unknown route.

```tsx
<Route path="*" element={<NotFound />} />
```

Now, whenever a user visits an invalid URL, the request reaches React, React Router fails to find a matching route, and the application renders the animated 404 page instead of Cloudflare serving a static file.

The experience stayed exactly the same.

It still includes:

- Rolling 3D cube
- Infinite rail stamps
- Terminal typing animation
- CSS keyframe animations

The difference is **who** decides when it appears.

Previously, Cloudflare did.

Now, React does.

That small architectural change gave the application complete control over its own routing and error experience.

---

## Fixing Invalid Slugs

Moving the 404 page into React exposed another issue.

Invalid slugs like `/newsletter/jhsfdvbvnm` were rendering the newsletter list page instead of the 404 animation.

The problem was in my post components:

```tsx
// NewsletterPost.tsx — before
if (!issue) return <Navigate to="/newsletter" replace />;

// BlogPost.tsx — before
if (!post) return <Navigate to="/blog" replace />;
```

Instead of showing a 404, they redirected back to the list page.

The fix was simple:

```tsx
// NewsletterPost.tsx — after
if (!issue) return <NotFound />;

// BlogPost.tsx — after
if (!post) return <NotFound />;
```

Now every invalid route — whether it's a completely random path or a non-existent slug — shows the animated 404.

---

## Designing Better Navigation

By this point, the deployment issues were finally behind me.

But fixing the technical problems exposed something else.

The user experience still wasn't quite right.

My portfolio opens with a short intro animation.

Originally, that animation replayed every time someone navigated between pages.

Technically, nothing was broken.

From a user experience perspective, though, it quickly became repetitive.

The intro should feel like a welcome—not an interruption.

That led me to rethink when it should actually appear.

### Direct Visits

When someone lands on the website for the first time, the intro helps establish the visual identity of the portfolio.

Whether they visit:

```text
/
```

or

```text
/blog/my-post
```

or

```text
/newsletter/my-article
```

they first see the intro.

Once it finishes, they're taken directly to the page they originally requested.

This keeps the first impression consistent without sacrificing deep linking.

---

### Client-Side Navigation

Once visitors are already inside the application, the rules change.

Navigating between:

```text
Home

↓

Blog

↓

Newsletter
```

should feel instant.

The intro has already done its job.

Playing it repeatedly would only slow navigation and make the application feel less responsive.

So client-side navigation skips the intro entirely, allowing React Router to switch routes immediately.

---

### Invalid URLs

The final scenario was invalid routes.

If someone opens:

```text
/this-page-does-not-exist
```

there's no reason to play an intro before showing an error.

Instead, React Router immediately renders the animated 404 page.

That keeps the behavior predictable and avoids making users wait for information they already need.

---

## Keeping the Logic Maintainable

Rather than scattering conditions throughout `App.tsx`, I moved the decision-making into a dedicated hook.

Instead of asking multiple questions across different components, the application only needs to answer one:

> **Should the intro play?**

The hook determines:

- Is this a full page load?
- Is the requested route valid?
- Has the intro already been shown during this session?

Encapsulating that logic keeps the routing behavior predictable, reusable, and much easier to maintain as the application grows.

---

## Final Routing Behavior

After all of these changes, the application behaves exactly as intended.

| Scenario | Result |
|----------|--------|
| Direct visit to `/` | Intro → Homepage |
| Direct visit to `/blog/:slug` | Intro → Blog post |
| Direct visit to `/newsletter/:slug` | Intro → Newsletter |
| Client-side navigation | No intro |
| Invalid URL | Animated React 404 |

Looking back, the routing itself wasn't particularly complicated.

The challenge was deciding **which layer** should be responsible for each part of the experience.

Cloudflare serves the application.

React Router controls navigation.

The application decides how users experience that navigation.

Once those responsibilities were clearly separated, every piece fell into place.

---

## Lessons Learned

This project taught me far more than I expected.

I started by trying to fix a simple 404 error, but every solution uncovered another layer of how modern web applications actually work.

Some of the biggest takeaways were:

- Static hosting platforms have routing behavior of their own, independent of your application.
- A physical `404.html` can prevent React Router from ever handling a request.
- `_routes.json` is intended for Cloudflare Workers—not static React SPAs.
- Catch-all rewrites like `/* /index.html 200` can create deployment loops.
- **Cloudflare Pages has two routing systems: built-in SPA fallback (lenient) and `_redirects` engine (strict with trailing-slash normalization).**
- **Adding configuration files (`_redirects`, `_routes.json`, `404.html`) switches you from the lenient system to the strict system.**
- **For a React SPA with client-side 404 handling, the best approach on Cloudflare Pages free tier is no routing config files at all.**
- React should own application routing—including custom 404 pages.
- Responsive animations are about adapting layouts, not rewriting animations.
- Navigation behavior is part of user experience, not just routing.

Looking back, every issue turned out to be logical once I understood **which layer** was responsible.

The difficult part wasn't fixing React.

It was identifying whether the browser, Cloudflare Pages, or the application owned that part of the request lifecycle.

---

## Final Thoughts

When I started this deployment, I was convinced I was debugging React Router.

In reality, I spent most of my time learning how **Cloudflare Pages** processes requests **before** React ever runs.

Once I understood where the browser stopped, where Cloudflare took over, and where React Router became responsible, every remaining issue became much easier to reason about.

That turned out to be the biggest lesson from this project.

Modern web development isn't just about knowing your framework.

It's about understanding every layer between the browser and your code, and knowing which layer owns each part of the request.

Looking back, every problem I encountered had a logical explanation.

The challenge wasn't solving complex bugs.

It was about understanding where to look.

---

> **A production-ready application isn't defined by whether it works—it's defined by whether every interaction feels intentional.**
