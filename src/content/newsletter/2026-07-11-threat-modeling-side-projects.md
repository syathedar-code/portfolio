---
title: "Threat Modeling Side Projects."
date: "2026-07-11"
excerpt: "We secure production enterprise apps, but leave our pet projects wide open. Here is how I built a lightweight STRIDE framework for my own build pipeline."
draft: false
---

Most developers treat side projects like the Wild West: no auth tokens are rotated, API keys are hardcoded in `.env.local` files that risk getting pushed to public repos, and serverless functions are deployed without rate limiting. 

We tell ourselves, *"It's just a portfolio project, who would target me?"*

But automated scrapers don't care about your traffic metrics. They scan GitHub commits for `re_` or `sk_` prefixes to hijack API credits, and botnets abuse open forms to trigger massive serverless usage bills. 

Here is how I threat-modeled this portfolio using a lightweight variation of the **STRIDE** framework.

---

### The Architecture Breakdown
Before mapping threats, you have to map data flow. In this setup, we have a classic static frontend communicating with decoupled serverless utilities:

[User Interface] ──(Email Input)──► [Netlify Function Router] ──(Full Access Key)──► [Resend API]

By isolating boundaries, we can look at the exact attack surfaces.

---

### Mapping the Core Threats

#### 1. Information Disclosure (API Key Leakage)
* **The Risk:** Pushing the Resend `Full Access` token directly to a public GitHub repository.
* **The Mitigation:** Absolute decoupling. The frontend has zero awareness of the API key. It triggers a relative path (`/.netlify/functions/subscribe`), shifting the cryptographic secret entirely to Netlify's backend environment variables.

#### 2. Denial of Service (Serverless Wallet Busting)
* **The Risk:** An attacker runs a basic `while(true)` loop script hitting the serverless endpoint, causing thousands of database writes or outbound requests, exhausting free tiers.
* **The Mitigation:** Implementing basic payload validation on the backend handler. By ensuring inputs strictly match email regex *before* invoking external fetches, we drop garbage traffic instantly. *(Next milestone: adding Upstash Redis rate-limiting).*

#### 3. Spoofing & Tampering (Dashboard Integrity)
* **The Risk:** Hijacking the email broadcast script to send spam to the entire contact database.
* **The Mitigation:** Restricting execution scopes. The automated newsletter delivery script lives strictly inside GitHub Actions, executing only when a cryptographically signed cryptographic push event occurs on the `main` branch.

---

### The Takeaway
Securing systems isn't about writing unbreakable code; it's about reducing the blast radius. By taking twenty minutes to map boundaries before writing the first line of this system, it handles data safely without adding complex maintenance overhead.

What's your current strategy for keeping your build pipelines locked down? Drop a reply or subscribe to trace the next system architecture teardown.
