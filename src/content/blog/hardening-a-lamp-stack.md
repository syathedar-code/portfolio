---
title: "Hardening a LAMP stack with SafeLine WAF"
date: "2026-07-15"
excerpt: "Notes from standing up SSL/TLS, firewall rules, and a WAF from scratch."
---

## Why I built this

I wanted to understand both sides of web security — building the app and also trying to break it. This post walks through the lab setup.

## The setup

I used Kali Linux as the attack box and Ubuntu as the target server running DVWA behind Apache and MySQL.

For background on how the WAF itself works, [click here](https://safepoint.cloud/products/safeline) to see their documentation.

## What I found

- SQL injection was blocked once the WAF was set to "Block" mode
- Logs captured full attack payloads for review
- Response time overhead was minimal

That's it — same lab from my resume, written up properly.
