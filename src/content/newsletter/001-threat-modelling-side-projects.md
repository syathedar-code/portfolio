---
title: "Threat Modelling Your Own Side Projects"
date: "2026-07-12"
issue: "#001"
excerpt: "Most devs ship side projects without a second thought about security. Here's a quick mental model to change that habit."
---

## Why bother threat modelling a side project?

It's not production, right? No real users, no real data — so why think about security?

Because habits are formed in the small stuff. The way you wire up auth in your weekend project is the same instinct you'll reach for at 2am on a real incident.

Here's a lightweight approach I use:

## The three questions

**1. What's the worst that could happen?**

List the three scariest outcomes. For a portfolio site: defacement, data exfil (if you store contact form submissions), or being used as a bot C2. Most side projects have a short list. Write it down.

**2. What's the attack surface?**

Map your entry points:
- Public endpoints (forms, APIs)
- Auth flows
- Dependencies (npm packages, Docker images)
- Hosting config (open S3 buckets, misconfigured reverse proxies)

**3. What's the cost of a fix vs. the cost of a breach?**

Not everything needs hardening. A static portfolio with no backend? Invest 10 minutes on CSP headers. A side project with user accounts? Spend a weekend on auth properly.

## The five-minute security checklist

- [ ] Dependency audit: `npm audit` or `pip-audit`
- [ ] CSP headers set
- [ ] No secrets in version control (`git grep` for API keys)
- [ ] Auth tokens expire and rotate
- [ ] Rate limiting on any public API endpoints

That's issue #001. Short, practical, no filler.

— Syed
