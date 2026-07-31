---
title: "Premature Conclusions: The Investigation That Humbled Me"
date: "2026-07-31"
excerpt: "It's about how I convinced myself I had found the root cause, wrote an entire blog explaining it, published it, shared it on LinkedIn, and then watched my own investigation prove me wrong."
---

# Premature Conclusions
## The Investigation That Humbled Me

I thought this article was going to be about Cloudflare Pages.

It isn't.

It's about how I built an airtight case against the wrong suspect, published my findings, and then watched a single control experiment reduce three days of investigation to confirmation bias.

This is the case file.

---

## TL;DR

One small feature request—adding a custom animated 404 page—turned into a three-day forensic investigation.

I documented Cloudflare Pages routing behavior, React Router request lifecycles, SPA fallback mechanics, `_redirects` validation, `_routes.json` scope, `200.html` fallback logic, trailing-slash normalization patterns, edge caching behavior, and browser-state contamination.

At one point I was so convinced that I:

- wrote a detailed technical blog establishing Cloudflare as the root cause,
- wrote a newsletter documenting the trailing-slash behavior,
- published a LinkedIn carousel summarizing the findings,

only to later discover that the entire theory was built on contaminated evidence.

The final control experiment proved the issue wasn't Cloudflare at all.

It was stale browser state inside my Brave profile.

The biggest bug wasn't in the infrastructure.

It was in the investigation itself.

---

## Part 1 — The Crime Scene

### Initial State

The portfolio was stable. Built with Vite, React, and React Router. Deployed on Cloudflare Pages. Deep links functioned. Blog posts loaded. Navigation was smooth. No open issues. No error logs. No complaints.

The only anomaly was aesthetic: the default Cloudflare 404 page did not match the portfolio's visual language. I wanted to replace it with a custom experience - a rolling 3D cube, terminal typing animation, infinite rail stamps, consistent with the rest of the site.

The implementation was trivial: `public/404.html`, committed, pushed, deployed.

### First Anomaly

Post-deployment, three behaviors were observed:

1. Homepage (`/`) → loaded correctly.
2. Client-side navigation (`/` → `/blog/post`) → loaded correctly.
3. Direct URL refresh (`/blog/post`) → returned 404.

The 404 was not the custom page. It was Cloudflare's default response. This indicated that Cloudflare was intercepting the request before React Router could mount.

### Initial Hypothesis (H₀)

> **H₀:** React Router configuration is misconfigured for production deep linking.

**Method:** Audited `src/router.tsx`, build output, and `vite.config.ts`. Compared against React Router documentation for SPA deployment.

**Result:** No configuration changes had been made. The router was identical to the previous stable deployment. H₀ was rejected.

---

## Part 2 — The Suspect

### Request Lifecycle Analysis

To understand why deep links failed, I mapped the full request path:

```
Browser Request
    ↓
Cloudflare Edge Node
    ↓
Static Asset Resolution
    ↓
HTML Delivery
    ↓
React Hydration
    ↓
React Router Mount
```

Under this model, if Cloudflare resolves the request to a static asset before React Router executes, the application never receives the original URL. React Router cannot match a route it never sees.

### Evidence Gathering

I reviewed Cloudflare Pages documentation and established the following rules:

- **Rule 1:** Static assets are served before any SPA logic.
- **Rule 2:** If `404.html` exists in the build output, Cloudflare serves it for all unmatched routes.
- **Rule 3:** The SPA fallback (serving `index.html` for unknown routes) is disabled when `404.html` is present.

**Conclusion from evidence:** `404.html` was not just a custom error page. It was a routing configuration that disabled the SPA fallback, causing all deep links to return 404 before React could load.

### First Corrective Action

Removed `public/404.html`. Rebuilt. Redeployed.

**Result:** Deep links restored. SPA fallback active. React Router controlled all routing.

**Side effect:** Custom 404 page lost.

---

## Part 3 — The Reconstruction

### Objective

Reconcile three requirements simultaneously:
1. Deep links must resolve to the application on refresh.
2. React Router must handle client-side navigation.
3. A custom 404 page must render for unknown routes.

### Method 1: `_redirects`

Cloudflare Pages supports a `_redirects` file for custom routing rules. I implemented a catch-all rewrite:

```text
/* /index.html 200
```

**Expected behavior:** Serve `index.html` for all unmatched routes without issuing an HTTP redirect.

**Actual behavior:** Cloudflare build rejected the rule with: "Infinite loop detected in this rule and has been ignored."

**Analysis:** Cloudflare's internal request normalization treats `/*` with a `200` rewrite as potentially recursive. The validator flags it before execution.

### Method 2: Granular Redirects

I tested few specific rules:

| Rule | Result |
|------|--------|
| `/blog /index.html 200` | Failed: did not handle `/blog/post` |
| `/blog/* /index.html 200` | Failed: did not handle `/blog` (no trailing slash) |
| `/blog /index.html 200!` | Failed: Cloudflare still applied normalization before rule evaluation |
| `/blog/ /index.html 200!` | Failed: same normalization interference |
| `/newsletter /index.html 200` | Failed: did not handle `/newsletter/issue-007` |
| `/newsletter/* /index.html 200` | Failed: did not handle `/newsletter` (no trailing slash) |
| `/newsletter /index.html 200!` | Failed: Cloudflare still applied normalization before rule evaluation |
| `/newsletter/ /index.html 200!` | Failed: same normalization interference |

**Observation:** Each failure provided new constraints. The `_redirects` engine was not behaving as a simple rewrite layer. It was interacting with Cloudflare's internal URL normalization in ways not fully documented for exact-path matches.

### Method 3: `_routes.json`

I discovered `_routes.json`, a configuration file for Cloudflare Workers routing. I spent approximately three hours researching its schema, scope, and compatibility with static Pages deployments.

**Result:** `_routes.json` is designed for Cloudflare Workers, not static Pages. It has no effect on SPA fallback behavior. Dead end.

### Method 4: `200.html`

Cloudflare Pages' documentation indicates that a file named `200.html` in the build output acts as a native SPA fallback. If present, Cloudflare serves it for all unmatched routes without requiring `_redirects`.

I implemented a Vite plugin to generate `200.html` automatically:

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

**Result:** Deep links worked. Custom 404 was still missing (Cloudflare served `200.html` for all unknown routes, so React Router never rendered `NotFound`).

### Method 5: React Router Ownership

I removed `200.html` and moved the 404 experience into the application layer:

```tsx
<Route path="*" element={<NotFound />} />
```

This gave React Router full control. Valid routes render their components. Invalid routes render `NotFound.tsx`.

**Secondary anomaly discovered:** Invalid slugs (`/blog/random-string`) were redirecting to `/blog` instead of rendering the 404 page.

**Root cause:** Post components used `<Navigate to="/blog" replace />` for missing posts.

**Fix:** Replaced with `<NotFound />`.

**Tertiary anomaly discovered:** The intro animation hook (`useIntroState`) only recognized `/blog/` and `/newsletter/` (with trailing slashes) as valid routes. Bare `/blog` was treated as invalid, causing the intro to skip.

**Fix:** Expanded route validation to accept both variants.

---

## Part 4 — The Theory

### New Anomaly

With all previous issues resolved, a new pattern emerged:

| URL | Phone | Laptop |
|-----|:-----:|:------:|
| `/blog` | Loads | Redirects to `/` |
| `/blog/` | Loads | Loads |
| `/newsletter` | Loads | Redirects to `/` |
| `/newsletter/` | Loads | Loads |
| `/blog/some-post` | Loads | Loads |

Nested routes worked. Top-level routes without trailing slashes failed—only on the laptop.

### Hypothesis (H₁)

> **H₁:** Cloudflare Pages applies trailing-slash normalization inconsistently across devices or edge nodes, sending a 308 permanent redirect for bare paths (`/blog` → `/blog/`) on some requests but not others.

### Evidence Supporting H₁

1. **Device inconsistency:** Same deployment, same code, different behavior across phone and laptop. This suggested a server-side or network-layer variable, not application code.

2. **Path specificity:** Only top-level directory-like paths were affected. Deep links (`/blog/post`) worked everywhere, suggesting the normalization rule targeted exact path matches.

3. **Timing:** The redirect occurred before React loaded. The browser's address bar changed before the application rendered, indicating an HTTP-level redirect rather than a client-side `Navigate`.

4. **Cloudflare documentation:** Cloudflare Pages is known to apply default trailing-slash behavior for directory-like paths when `_redirects` is present. Although I had removed `_redirects`, I suspected residual edge-node caching or configuration state.

5. **Precedent:** Multiple forum discussions documented similar behavior where Cloudflare's `_redirects` engine enables strict normalization that persists even after rule removal.

### Research Phase

I conducted a systematic review:
- Cloudflare Pages routing documentation
- Community discussions on trailing-slash behavior
- Edge caching and normalization specifications
- Comparison of SPA fallback vs. `_redirects` engine behavior

**Key finding:** Cloudflare Pages has two distinct routing systems:

| System | Trigger | Trailing-Slash Behavior |
|--------|---------|------------------------|
| Built-in SPA fallback | No `404.html`, no `_redirects` | No normalization |
| `_redirects` engine | `_redirects` file exists | Normalization enabled |

I had used `_redirects` earlier in the investigation. Even though I deleted the file, I suspected that the deployment had been "flagged" into the strict routing system, or that edge nodes retained cached routing rules.

### Confidence Level

By the end of Day 3, I had:
- A documented mechanism (Cloudflare trailing-slash normalization)
- Reproducible symptoms (device-dependent behavior)
- A coherent narrative (strict routing system interaction)
- Technical precedent (community reports)

I assessed H₁ as **confirmed**.

---

## Part 5 — The Prosecution

### Publication

With H₁ confirmed, I prepared three pieces of content:

1. **Newsletter #008:** *"The Trailing Slash That Broke My Portfolio"* — A focused analysis of the device inconsistency and normalization behavior.

2. **Technical Blog:** *"Everything I Learned Deploying a React SPA to Cloudflare Pages"* — A comprehensive case study covering the two routing systems, the `_redirects` trap, and why deleting all routing configuration is the only reliable fix on the free tier.

3. **LinkedIn Carousel:** A visual summary of the findings for professional distribution.

I published all three.

I was certain.

---

## Part 6 — The Alibi

### Control Experiment

Four days into the investigation, I conducted a routine verification that I had not previously considered: testing the same URL in a clean browser environment.

**Test:** Open Brave Private Window. Navigate to `/blog`.

**Result:** Page loaded correctly. No redirect. No trailing slash required.

**Significance:** This result was impossible under H₁. If Cloudflare's edge nodes or routing rules were causing the redirect, a different browser state would not matter. The server responds identically regardless of client cookies or cache.

### Expanded Testing

I designed a controlled experiment to isolate the variable:

| Browser / State | `/blog` Result | `/blog/` Result |
|-----------------|:--------------:|:---------------:|
| Chrome (normal) | ✅ Loads | ✅ Loads |
| Firefox (normal) | ✅ Loads | ✅ Loads |
| Brave Private Window | ✅ Loads | ✅ Loads |
| Brave (fresh profile) | ✅ Loads | ✅ Loads |
| Brave (existing profile) | ❌ Redirects to `/` | ✅ Loads |

**Conclusion:** The failure was tied to a single browser profile, not the deployment, not the network, not Cloudflare.

### Network Forensics

I opened DevTools in the failing Brave profile and examined the Network tab during a refresh of `/blog`.

**Expected under H₁:** A 308 or 301 redirect response from Cloudflare.

**Actual:** `GET /blog 200 OK`. No redirect. No 3xx status code.

Cloudflare was serving the correct file. The browser was receiving `200 OK`. The redirect was not happening at the network layer.

### Cache Analysis

I executed **Empty Cache and Hard Reload** .

**Result:** `/blog` loaded correctly immediately.

No deployment. No code change. No commit. The fix was instantaneous.

### Service Worker Audit

I checked `Application → Service Workers` in DevTools.

**Result:** None registered.

### H₁ Status

**Rejected.** The evidence that supported H₁—device inconsistency, path specificity, pre-React timing, was explained by a confounding variable- stale browser state (likely cached redirect behavior or internal browser routing records) inside my primary Brave profile.

The symptoms were real. The cause was not Cloudflare.

---

## Part 7 — The Verdict

### What Actually Happened

The deployment was correct from the beginning. Cloudflare was serving `200 OK` for all routes. React Router was behaving correctly. The browser was receiving the right files.

My Brave browser profile had an accumulated state, most likely a cached redirect record or internal path mapping that caused `/blog` to resolve differently from `/blog/`. I do not know the exact mechanism, and I stopped investigating once I understood the implications for the published content.

### What This Means for the Published Work

All three published pieces were based on a false premise. The technical details about Cloudflare's routing systems were accurate, but they were not the cause of *my* bug. The blog, newsletter, and LinkedIn post attributed a behavior to Cloudflare all of that was actually caused by my own browser state.

This is not a minor error. It is a fundamental misattribution.

---

## Part 8 — The Confession

### The Real Defect

Not Cloudflare. Not React. Not Brave.

The investigation itself.

### Methodological Failure

Here is the correct investigative flow:

```
Observation → Hypothesis → Experiments → Conclusion
```

Here is the flow I actually followed:

```
Observation → Hypothesis → Selective Evidence Gathering → Conclusion
```

I committed confirmation bias at scale. I formed a conclusion and then systematically gathered evidence that supported it. I did not design experiments to disprove my own theory. I did not test across browser states before attributing behavior to infrastructure. I did not isolate variables.

### Specific Errors

1. **Premature attribution:** I observed device inconsistency and immediately attributed it to the server layer. I did not test whether the inconsistency persisted across browser states on the same device.

2. **Confirmation bias in documentation:** I read Cloudflare documentation looking for evidence that supported H₁. I found it. I did not read the same documentation looking for evidence that would contradict H₁.

3. **Publication before verification:** I published findings after the theory *felt* solid, not after it had survived rigorous falsification attempts.

4. **Ignoring base rates:** The simplest explanation was browser cache contamination, statistically more common than edge-node routing inconsistencies. I ignored the base rate because the complex explanation was more interesting.

### Why It Felt Right

The theory was elegant. It explained every symptom. It had technical precedent. It made me look like I had uncovered a platform quirk.

The most dangerous bugs are not the ones that make no sense. They are the ones that make *perfect* sense. When a theory is comprehensive, internally consistent, and intellectually satisfying, you stop looking for the crack.

The crack was there. I just wasn't looking for it.

---

## Part 9 — The Evidence Locker

### Appendix A: Timeline

- Added `public/404.html`. Deployed. Deep links broke.
- Deleted `404.html`. Deep links restored. No custom 404.
- Began `_redirects` experiments. Catch-all rejected. Granular rules failed.
- Researched `_routes.json`. Dead end.
- Implemented `200.html` Vite plugin. Partial success.
- Moved 404 to React Router. Fixed invalid slug redirects. Fixed intro animation hook.
- Discovered trailing-slash inconsistency: phone worked, laptop didn't.
- Formulated H₁: Cloudflare trailing-slash normalization.
- Completed research. Assessed H₁ as confirmed.
- Published newsletter, blog, and LinkedIn post.
- Control test: Brave Private Window. H₁ contradicted.
- Expanded control testing across browsers and profiles.
- Network forensics: no 3xx responses from Cloudflare.
- Cache clear + hard reload. Instant fix.
- Deleted all published content.

### Appendix B: Deployment Log

I lost count after 10-11 deployments. Cloudflare Pages triggered a build on every push. Each experiment required: commit → push → wait (45-90 seconds) → test → log results → repeat.

### Appendix C: Failed `_redirects` Rules

```text
/* /index.html 200                    → REJECTED: Infinite loop

/blog /index.html 200                → FAILED: No nested route support
/blog/* /index.html 200              → FAILED: Missed bare /blog
/blog /index.html 200!               → FAILED: Normalization interference
/blog/ /index.html 200!              → FAILED: Same interference

/newsletter /index.html 200          → FAILED: No nested route support
/newsletter/* /index.html 200        → FAILED: Missed bare /newsletter
/newsletter /index.html 200!         → FAILED: Normalization interference
/newsletter/ /index.html 200!        → FAILED: Same interference
```

### Appendix D: Final Architecture

The working configuration contains **no routing configuration files**:

```
public/
  (no 404.html)
  (no _redirects)
  (no _routes.json)

src/
  pages/
    NotFound.tsx    ← React Router owns 404 rendering
```
200.html just incase anything else fails.

Cloudflare Pages built-in SPA fallback serves `index.html` for all unmatched routes when no routing configuration files exist. React Router then handles all routing, including the catch-all `*` route for 404s.

### Appendix E: The Actual Fix

| Action | Deployment Required | Code Change Required |
|--------|:-------------------:|:--------------------:|
| DevTools → Clear site data → Hard reload | No | No |
| Brave → New Private Window | No | No |
| Fresh browser profile | No | No |

The fix was present before any of the three days of investigation. It required only a clean browser state.

---

## The Ending

I set out to build a custom 404 page.

I ended up conducting a three-day investigation that produced a coherent, well-documented, entirely wrong conclusion.

For three days I believed I was fighting Cloudflare Pages. I wasn't. I was fighting my own certainty. The deployment wasn't broken. My assumptions were.

Looking back, deleting the blog and LinkedIn post wasn't the embarrassing part.

The embarrassing part would've been leaving them online after I knew they were wrong.

If this case file helps even one engineer stop and ask, *"What experiment would prove me wrong?"*, then those three days were worth it.

The biggest bug wasn't in the code.

It was in the investigation.

And it turned out to be not something that I couldn't fix, but something I can actually fix and learn from.

---

## One Final Note

Cloudflare Pages is not the villain of this story, and I am not the Sherlock Holmes who uncovered its flaws.

Cloudflare Pages does have two routing systems. It does exhibit trailing-slash behavior that can surprise developers. `404.html` does disable the SPA fallback. `_redirects` does enable strict normalization. All of these facts are true, and all are documented.

But none of them caused my bug.

I blamed Cloudflare because I had a theory that required a villain. The platform was complex enough to hide behind. The truth that my own browser had stale state and my own reasoning had stale rigor, was less flattering and less shareable.

This case file is not really about routing, React, or Cloudflare. It is about how an engineer forms hypotheses, gathers evidence, realizes their own blind spots, and has the integrity to correct the public record when the evidence changes.

That story is far more valuable than another "how to fix React Router on Cloudflare Pages" guide.

---
Yours truly,
*— Syed Athar*
