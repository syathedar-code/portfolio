---
title: "Hardening a LAMP Stack with SafeLine WAF"
date: "2026-07-12"
excerpt: "Building a vulnerable web application, securing it with SafeLine WAF, and observing how real-world attacks are detected and blocked."
---

## Why I built this

Most web development projects focus on building features. I wanted to understand what happens after deployment—how applications are attacked and how modern defenses respond.

Instead of only reading about web security, I created a small lab where I could safely launch attacks against my own application and observe how a Web Application Firewall (WAF) protects it.

The objective wasn't just to install a WAF, but to understand what it actually does when malicious traffic reaches a server.

---

## Lab Environment

The environment was built using two virtual machines.

| Machine | Purpose |
|----------|---------|
| Kali Linux | Attack machine used for penetration testing |
| Ubuntu Server | Target machine hosting the web application |

The target server consisted of:

- Apache Web Server
- MySQL Database
- PHP
- DVWA (Damn Vulnerable Web Application)
- SafeLine Web Application Firewall

The WAF was placed in front of Apache so every incoming request passed through SafeLine before reaching the application.

---

## Why DVWA?

DVWA is intentionally vulnerable, making it perfect for learning common web application attacks without risking production systems.

It contains multiple security levels and includes vulnerabilities such as:

- SQL Injection
- Cross-Site Scripting (XSS)
- Command Injection
- File Inclusion
- CSRF

This made it possible to compare application behavior before and after enabling the WAF.

---

## Configuring SafeLine

SafeLine was configured as a reverse proxy in front of the Apache server.

After the initial setup, I:

- Configured SSL/TLS
- Enabled attack logging
- Switched protection mode from **Monitor** to **Block**
- Verified request forwarding to Apache
- Tested normal user traffic before attempting attacks

For more information about SafeLine itself, visit their official documentation:

https://safepoint.cloud/products/safeline

---

## Testing the Environment

Once everything was running, I launched several common web attacks from the Kali machine.

### SQL Injection

Using DVWA's SQL Injection module, I attempted authentication bypass and database enumeration.

Without the WAF, the payloads reached the application successfully.

Once SafeLine was switched to **Block Mode**, the malicious requests were intercepted before Apache processed them.

---

### Cross-Site Scripting (XSS)

Several reflected XSS payloads were submitted through DVWA.

SafeLine detected suspicious JavaScript patterns and blocked the requests while recording the event in its dashboard.

---

### Request Logging

One of the most useful features was the logging interface.

Each blocked request included:

- Source IP
- Attack category
- Request URL
- Detection rule
- Full payload
- Timestamp

Being able to inspect actual payloads helped me understand how attack signatures are matched.

---

## Performance

One concern with deploying a WAF is additional latency.

In this small lab environment, normal browsing remained responsive, and I did not notice any significant delay while accessing the application.

Although this isn't a production benchmark, it showed that enabling protection didn't noticeably impact usability for this setup.

---

## What I Learned

This project helped connect several concepts that are usually learned separately.

I gained practical experience with:

- Deploying a complete LAMP stack
- Configuring Apache and MySQL
- Reverse proxy architecture
- SSL/TLS configuration
- Web Application Firewalls
- Identifying common web attacks
- Reading security logs and blocked requests

More importantly, I learned that a WAF should be viewed as an additional security layer—not a replacement for writing secure applications.

---

## Final Thoughts

Building this lab changed the way I think about web applications.

Developers often focus on functionality, while attackers focus on finding assumptions and weaknesses. Seeing both perspectives made it much easier to appreciate secure coding practices and layered defense.

This project is one of the first labs where I moved beyond theory and explored how modern web security tools operate in practice, and it's something I plan to continue expanding with additional attack scenarios and defensive technologies.