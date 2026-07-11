# Syed Maaz Athar — Portfolio

Personal portfolio site built with React, TypeScript, Vite, and Tailwind CSS.
Terminal-inspired design: skills render as `systemctl status` service panels,
sections are addressed as shell commands, and the palette borrows from an
amber phosphor CRT rather than the usual matrix-green cliché.

## Stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server and build
- [Tailwind CSS v3](https://tailwindcss.com/) (standard PostCSS pipeline) for styling
- No external UI kit — components are hand-built and kept small

This is a deliberately conventional stack: current LTS-friendly versions of
each tool, no bleeding-edge config formats, nothing that needs an unusual
Node version or a non-standard build step. Anyone with Node 18+ and npm can
clone this and run it.

## Project structure

```
src/
├─ components/       # One component per section (Hero, About, Skills, ...)
├─ data/             # Content lives here, separate from presentation
│  ├─ skills.ts
│  ├─ experience.ts
│  ├─ projects.ts
│  ├─ certifications.ts
│  └─ contact.ts
├─ types.ts          # Shared TypeScript interfaces for the data layer
├─ App.tsx            # Composes all sections
├─ main.tsx           # React entry point
└─ index.css          # Tailwind import + theme tokens
```

Editing content (a new project, an updated role, a different email) only
means touching a file under `src/data/` — no component code needs to change.

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
npm run lint       # run eslint
```

## Deploying

The build output in `dist/` is static and can be deployed to GitHub Pages,
Netlify, Vercel, or any static host. For GitHub Pages via GitHub Actions,
point the workflow at `npm run build` and publish the `dist/` directory.

## License

MIT
