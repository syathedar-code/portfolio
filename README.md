
# Syed Maaz Athar — Portfolio & Technical Publishing Platform

> A modern developer portfolio, technical blog, and newsletter platform built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Designed with an application security and Linux terminal aesthetic, it showcases projects, engineering articles, certifications, and professional experience through a fast, static-first architecture.

**Live Demo:** https://syedathar-portfolio.pages.dev
**Blog:** https://syedathar-portfolio.pages.dev/blog  
**Newsletter:** https://syedathar-portfolio.pages.dev/newsletter  
**Resume:** `/Syed_Maaz_Athar_CV.pdf`

# Features

### Portfolio
- Interactive terminal-inspired landing experience
- Professional project showcase
- Experience timeline
- Skill matrix
- Certification gallery with previews
- Downloadable resume

### Technical Publishing
- Markdown-powered engineering blog
- Newsletter archive
- GitHub Flavored Markdown support
- Search and sorting
- Clean article URLs

### Developer Experience
- Content generation CLI (`npm run write`)
- Build-time Markdown compilation
- Compile-time Git metadata injection
- Strict TypeScript models
- Static deployment with zero backend

---

# Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React, TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Markdown | React Markdown, Remark GFM |
| Animation | Framer Motion |
| Hosting | Cloudflare Pages |
| Tooling | ESLint, Node.js |

---

# Quick Start

```bash
git clone https://github.com/syathedar-code/portfolio.git

cd portfolio

npm install

npm run dev
```

Build production assets:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Create a new blog post or newsletter:

```bash
npm run write
```

---

# Project Structure
```
.
├── public/                # Static public assets (CV PDF, certificate images, favicon, _redirects)
├── scripts/               # Developer CLI tooling (scaffolding post templates & automated tasks)
├── src/
│   ├── components/        # Hand-crafted UI components (terminal modules, search overlay, layout)
│   ├── content/           # Raw Markdown files for blog posts and newsletter editions
│   ├── data/              # Typed static data fixtures (skills, projects, experience, certs)
│   ├── hooks/             # Custom React hooks (intro terminal state & layout management)
│   ├── lib/               # Dynamic markdown loaders and frontmatter parsing utilities
│   ├── pages/             # Route-level views (Home, Blog, Newsletter, Post reader, 404)
│   ├── App.tsx            # Main application router and root layout composer
│   ├── index.css          # Tailwind CSS directives & custom amber CRT theme variables
│   ├── main.tsx           # React DOM application entry point
│   └── types.ts           # Shared TypeScript domain types and data interfaces
├── index.html             # Application HTML template & metadata entry
├── tailwind.config.js     # Tailwind design system configuration
└── vite.config.ts         # Vite bundler, path aliases, and build settings
```

### Architecture Highlights

- **`src/content/` & `src/lib/`**: Content is authored as standalone Markdown files with YAML frontmatter. The `lib/` module leverages Vite's `import.meta.glob` to load, extract frontmatter, and expose queryable post objects at build time without requiring an external CMS or database.
- **`src/data/`**: Static domain datasets (skills, work history, projects, certifications) are maintained in typed data fixtures, keeping content decoupled from presentation components.
- **`src/hooks/`**: Encapsulates complex stateful UI behaviors—such as shell/terminal intro sequences—keeping component templates clean and declarative.
---

# Architecture

```text
Browser
    │
    ▼
Cloudflare Pages
    │
    ▼
index.html
    │
    ▼
React Router
    │
    ▼
Layout
    │
 ┌──┴──────────────┐
 ▼                 ▼
Portfolio      Markdown Engine
                    │
                    ▼
            Blog / Newsletter
```

The application follows a **static-first architecture**. Portfolio data is stored as typed TypeScript objects, while blog posts and newsletters are written in Markdown and bundled at build time using Vite's `import.meta.glob`. This eliminates runtime API requests while keeping content easy to maintain.

---

# Routing

| Route | Description |
|------|-------------|
| `/` | Portfolio homepage |
| `/blog` | Blog archive |
| `/blog/:slug` | Individual blog post |
| `/newsletter` | Newsletter archive |
| `/newsletter/:slug` | Individual newsletter |
| `*` | Custom animated React 404 page |

---

# Engineering Decisions

- **BrowserRouter over HashRouter** for clean URLs and improved sharing.
- **Build-time Markdown loading** using `import.meta.glob` for instant navigation without fetch requests.
- **React-owned 404 handling** instead of a static `404.html`, ensuring Cloudflare Pages correctly forwards routes to React.
- **Static-first architecture** keeps deployment simple, fast, and maintenance-free.

---

# Performance

- Markdown bundled during build time
- Zero runtime API requests
- Automatic code splitting with Vite
- GPU-accelerated CSS animations
- Optimized static deployment on Cloudflare's edge network

---

# Deployment

The project is optimized for **Cloudflare Pages**.

Build settings:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

SPA routing is handled through `public/_redirects`:

```text
/*   /index.html   200
```

A static `404.html` is intentionally **not** included, allowing React Router to handle unknown routes consistently.

---

# License

MIT
