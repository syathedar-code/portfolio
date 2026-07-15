---
title: "The Timestamp That Refused to Update"
date: "2026-07-15"
issue: "#005"
excerpt: "Everything in my portfolio footer updated after every deployment, except one tiny detail. The build timestamp was always one commit behind."
---

> **Today's takeaway:** If your build process writes new files while it's compiling, don't be surprised when the build starts reading yesterday's state.


## It started with a tiny inconsistency

My portfolio footer acts like a miniature terminal.

Every deployment displays a few live development metrics:

- Current Git commit hash
- Latest commit message
- Build timestamp
- Portfolio uptime

After every push, I expected all four values to update together.

Three of them did.

One refused.

The **build timestamp** was always one deployment behind.

It wasn't broken enough to be obvious.

It was just wrong enough to become annoying.


## The original implementation

Before every build, a small script named `generateBuildInfo.js` would run.

Its job was simple:

```text
Git
    ↓
generateBuildInfo.js
    ↓
src/generated/buildInfo.ts
    ↓
React imports the file
    ↓
Footer
```

The script executed a few Git commands, collected repository metadata, and generated a TypeScript file that the frontend imported.\
At first glance, it looked like a clean solution.\
Until I looked closer.


## The real problem

The strange part was that only **one** piece of metadata was wrong.\
The commit hash matched the latest deployment.\
The commit message updated immediately.\
The uptime behaved exactly as expected.

Only the **commit timestamp** remained stuck on the previous deployment.

That ruled out Git itself as the culprit.

Somewhere in the build pipeline, the timestamp was being captured at the wrong moment. Everything else reflected the current commit, but the date was always inherited from the one before it.

It wasn't an obvious failure.\
It was a tiny synchronization bug hiding in an otherwise correct system.


## The realization

Then came the obvious question.

**Why was I generating a file in the first place?**

The frontend didn't need another source file.

It only needed a few strings while Vite was compiling.

Once I stopped thinking in terms of files, the solution became much simpler.


## The fix

Instead of writing `buildInfo.ts`, I moved the Git logic directly into `vite.config.ts`.

Using Node's `child_process.execSync()`, Vite now reads the latest Git information during compilation and injects it as compile-time constants through the `define` configuration.

The new flow became:

```text
Git
    ↓
vite.config.ts
    ↓
Compile-time constants
    ↓
React Footer
```

No extra imports.

No synchronization issues.

To keep TypeScript happy, I declared the injected globals inside `vite-env.d.ts`.

The footer simply reads those values directly and formats the timestamp with JavaScript's native `toLocaleDateString("en-IN")`.


## The result

The codebase became smaller.

The `generated` folder disappeared.

`package.json` became cleaner.

There was no need to maintain another build script.

Most importantly, every deployment now displays the correct build timestamp immediately—whether I build locally or push straight to production.

Sometimes removing a layer is more powerful than improving it.


## Today's thought

As developers, we often solve problems by adding another script, another file, or another abstraction.
Sometimes that's the right call.
Other times, the abstraction becomes the bug.
In this case, the solution wasn't a better generator.
It was realizing the generator never needed to exist.


That's issue #005. Short, practical, no filler.

— Syed Athar