import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('📝 Content Creator Automation');
  const typeInput = await askQuestion('Is this a (1) Daily Newsletter or (2) Weekly Blog? Enter 1 or 2: ');
  
  const isNewsletter = typeInput.trim() === '1';
  const type = isNewsletter ? 'newsletter' : 'blog';
  
  const title = await askQuestion(`Enter ${type} title: `);
  const summary = await askQuestion('Enter a brief summary (for social previews): ');

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const date = new Date().toISOString().split('T')[0];
  const filename = `${date}-${slug}.md`;
  const targetDir = path.join(process.cwd(), `src/content/${type}`);

  const template = `---
title: "${title}"
date: "${date}"
summary: "${summary.replace(/"/g, '\\"')}"
draft: false
---

Start writing your ${type} content here!
`;

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(path.join(targetDir, filename), template);
  console.log(`\n🚀 Success! Created file at: src/content/${type}/${filename}`);
  rl.close();
}

main();