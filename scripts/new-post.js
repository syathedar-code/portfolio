import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

/** Zero-pad a number to at least 3 digits, e.g. 1 → "001" */
const padIssue = (n) => String(n).padStart(3, '0');

async function main() {
  console.log('📝 Content Creator Automation');
  const typeInput = await askQuestion('Is this a (1) Newsletter or (2) Blog Post? Enter 1 or 2: ');

  const isNewsletter = typeInput.trim() === '1';
  const type = isNewsletter ? 'newsletter' : 'blog';

  const title = await askQuestion(`Enter ${type} title: `);
  const excerpt = await askQuestion('Enter a one-line excerpt (shown in previews): ');

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const date = new Date().toISOString().split('T')[0];

  let filename;
  let template;

  if (isNewsletter) {
    // Derive next issue number from existing files in the newsletter directory
    const newsletterDir = path.join(process.cwd(), 'src/content/newsletter');
    let nextIssue = 1;
    if (fs.existsSync(newsletterDir)) {
      const existing = fs.readdirSync(newsletterDir)
        .map((f) => parseInt(f, 10))
        .filter((n) => !isNaN(n));
      if (existing.length > 0) nextIssue = Math.max(...existing) + 1;
    }

    const issueLabel = `#${padIssue(nextIssue)}`;
    filename = `${padIssue(nextIssue)}-${slug}.md`;

    template = `---
title: "${title}"
date: "${date}"
issue: "${issueLabel}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
---

## Why this matters

// Introduce the topic — why should the reader care?

## The core idea

// Explain the concept, mental model, or framework you're sharing.

## Practical takeaways

- Point one
- Point two
- Point three

That's issue ${issueLabel}. Short, practical, no filler.

— Syed
`;
  } else {
    filename = `${date}-${slug}.md`;

    template = `---
title: "${title}"
date: "${date}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
---

## Introduction

// Start writing here.
`;
  }

  const targetDir = path.join(process.cwd(), `src/content/${type}`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, template);
  console.log(`\n🚀 Created: src/content/${type}/${filename}`);
  rl.close();
}

main();