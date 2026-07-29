---
title: "The Cloudflare Pages SPA Routing Bug That Had Me Chasing 404s"
date: "2026-07-29"
excerpt: "A deep dive into fixing React Router deep links on Cloudflare Pages, eliminating static 404 conflicts, making a complex animated 404 page mobile-friendly, and designing an intro experience that feels intentional."
---

# From 404s to Deep Links: Building a Production-Ready React SPA on Cloudflare Pages

Deploying a React application is usually the easy part.

Making it behave like a polished, production-ready website?

That's where things get interesting.

I recently deployed my portfolio to **Cloudflare Pages**, built with **Vite**, **React**, and **React Router**. Everything worked perfectly during development, but production immediately exposed problems I never encountered locally.

Refreshing a blog post returned a 404.

Deep links didn't work.

My animated intro played at the wrong times.

Even my custom 404 page became the cause of another routing issue.

What started as a simple deployment turned into a deep dive into how Cloudflare Pages actually serves Single Page Applications (SPAs).

Here's everything I learned.

---

## The Stack

The portfolio is built with:

- React
- Vite
- TypeScript
- React Router (`BrowserRouter`)
- Tailwind CSS
- Framer Motion
- Cloudflare Pages

The routing structure is fairly straightforward:

```text
/
/blog
/blog/:slug
/newsletter
/newsletter/:slug
```

Locally...

Everything worked.

```bash
npm run dev
```

No routing issues.

No broken pages.

Production had other plans.

---

## The First Problem

Client-side navigation worked perfectly.

Clicking a blog post...

Worked.

Clicking a newsletter...

Worked.

Refreshing the browser...

Didn't.

Opening a bookmarked URL like:

```text
/blog/2026-07-14-discipline-a-side-effect
```

immediately returned:

```
404
```

React Router wasn't even getting a chance to render.

Cloudflare intercepted the request before React ever loaded.

---

## Understanding Why

React Router only controls navigation **after** your application has loaded.

When you click a React `<Link>`:

```
Browser
↓

React Router

↓

Component renders
```

No request ever reaches the server.

Refreshing is completely different.

```
Browser

↓

Cloudflare Pages

↓

GET /blog/my-post
```

Cloudflare now has to decide:

> "Do I have a physical file for this URL?"

There wasn't one.

So it fell back to its own routing behavior.

That's where everything began.

---

## The File That Broke Everything

I had built a custom animated 404 page earlier.

It lived here:

```text
public/
└── 404.html
```

Since Vite copies everything inside `public/` into the production build, deployment looked like this:

```text
dist/
├── index.html
├── assets/
└── 404.html
```

I assumed Cloudflare would only serve that file when React couldn't find a route.

That assumption was wrong.

Cloudflare has a very strict rule:

> **If `404.html` exists, it always wins.**

That means requests like:

```
/blog

/newsletter

/blog/my-post
```

never reached React.

Cloudflare immediately served:

```
404.html
```

Deleting one file solved hours of debugging.

---

## My First Attempt

Like most developers, I reached for:

```text
_routes.json
```

It looked promising.

Except...

It's meant for **Cloudflare Functions (Workers)**.

I wasn't using Workers.

I was hosting a static React application.

The file wasn't helping.

In fact, having both `_routes.json` and `_redirects` only complicated things further.

Lesson learned:

> **Use `_routes.json` for Workers, not static SPAs.**

---

## My Second Attempt

Next I tried the classic SPA rewrite.

```text
/* /index.html 200
```

Seems logical.

Rewrite everything to React.

Cloudflare disagreed.

Deployment logs showed:

```
Infinite loop detected.
```

Why?

Because:

```
/index.html
```

also matches:

```
/*
```

Cloudflare detects the rewrite loop and ignores the rule entirely.

That wasn't the solution either.

---

## The Fix That Finally Worked

Instead of rewriting everything, I only rewrote the routes my application actually owns.

```text
/blog          /index.html 200
/blog/*        /index.html 200
/newsletter    /index.html 200
/newsletter/*  /index.html 200
```

Now Cloudflare understands exactly what should be handed over to React.

Everything else falls through naturally.

Combined with deleting `404.html`, direct links finally worked.

Refreshing worked.

Bookmarks worked.

Deep links worked.

---

## Bringing the 404 Page Back

Deleting the static 404 page didn't mean losing the design.

I simply moved it into React.

Instead of:

```text
public/404.html
```

I created:

```text
src/pages/NotFound.tsx
```

React Router now owns every unknown route.

```tsx
<Route path="*" element={<NotFound />} />
```

The animation stayed exactly the same.

It still includes:

- Rolling 3D cube
- Infinite rail stamps
- Terminal typing animation
- CSS keyframe animations

The difference is that React now decides when it appears instead of Cloudflare.

---

## Making It Mobile Without Touching the Animation

The desktop animation looked great.

Mobile...

Not so much.

The cube overflowed the screen.

The terminal text wrapped awkwardly.

Perspective felt too aggressive.

The challenge was preserving **every animation** while making it responsive.

That meant:

- Scaling the cube and rail stamps proportionally.
- Adjusting `translateZ()` values to preserve the 3D illusion.
- Using `clamp()` for fluid typography.
- Switching from `100vh` to `100dvh` to account for mobile browser chrome.
- Adding `overflow: hidden` to prevent horizontal scrolling.
- Tweaking perspective values at responsive breakpoints.

What I intentionally **didn't** change was just as important.

Every animation remained identical.

The keyframes.

The easing curves.

The animation delays.

The timing functions.

Even the terminal typing logic stayed untouched.

Only the sizing changed.

The result is the same experience across devices—just scaled appropriately.

---

## Designing Better Navigation

The final behavior became much more intentional.

### Direct visits

If someone opens:

```
/

or

/blog/my-post

or

/newsletter/my-article
```

they see the intro first.

Then they're taken directly to the page they requested.

---

### Client-side navigation

If they're already inside the website and click:

```
Home

↓

Blog

↓

Newsletter
```

the intro never appears again.

Navigation feels instant.

Exactly how React Router is supposed to work.

---

### Invalid URLs

If someone enters:

```
/this-page-does-not-exist
```

there's no intro.

They immediately see the animated React 404 page.

There's no reason to make someone watch an intro before telling them the page doesn't exist.

---

## The Professional Solution

Rather than scattering conditions throughout `App.tsx`, I moved the logic into a dedicated hook.

The hook determines:

- Is this a full page load?
- Is this a valid application route?
- Has the intro already been shown this session?

That keeps the routing logic predictable, reusable, and easy to maintain.

Instead of writing multiple nested conditions, the application simply asks:

> Should the intro play?

The hook answers that question.

Everything else becomes declarative.

---

## Final Routing Behavior

| Scenario | Result |
|----------|--------|
| Direct visit to `/` | Intro → Homepage |
| Direct visit to `/blog/:slug` | Intro → Blog post |
| Direct visit to `/newsletter/:slug` | Intro → Newsletter |
| Client-side navigation | No intro |
| Invalid URL | Animated React 404 |

The application now behaves exactly as users expect.

---

## Lessons Learned

This project taught me much more than routing.

- `404.html` completely overrides SPA routing on Cloudflare Pages.
- `_redirects` is the correct solution for static React SPAs.
- Catch-all rewrites can create deployment loops.
- React should own your 404 page—not the hosting platform.
- Responsive animations aren't about rewriting animations; they're about scaling them correctly.
- Navigation isn't just technical—it's part of the user experience.

The last point surprised me the most.

Fixing routing solved the bug.

Designing navigation solved the experience.

They're not the same thing.

---

## Final thoughts

Most deployment issues aren't caused by React.

They're caused by understanding how your hosting platform interacts with your application.

Once the technical problems were solved, the real challenge became deciding **how users should experience the application.**

Should an intro play?

When?

Should a 404 interrupt that flow?

Those aren't deployment questions.

They're product decisions.

And they're just as important.

---

> **A production-ready application isn't defined by whether it works—it's defined by whether every interaction feels intentional.**

---