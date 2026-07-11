import fs from 'fs';
import path from 'path';

async function broadcast() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing RESEND_API_KEY environment variable.");
    process.exit(1);
  }

  const dirPath = path.join(process.cwd(), 'src/content/newsletter');

  if (!fs.existsSync(dirPath)) {
    console.log('ℹ️ No newsletter directory found. Skipping broadcast.');
    return;
  }

  // Get all files and sort them to find the newest one
  const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.md'));
  if (files.length === 0) {
    console.log('ℹ️ No newsletter files found to broadcast.');
    return;
  }

  files.sort();
  const latestFile = files[files.length - 1];
  const filePath = path.join(dirPath, latestFile);
  const rawContent = fs.readFileSync(filePath, 'utf-8');

  // Simple Frontmatter Parser logic
  const frontmatterMatch = rawContent.match(/^---([\s\S]*?)---/);
  if (!frontmatterMatch) {
    console.error(`❌ Invalid frontmatter format in ${latestFile}`);
    process.exit(1);
  }

  const lines = frontmatterMatch[1].split('\n');
  let title = 'Daily Dev Update';

  lines.forEach(line => {
    if (line.startsWith('title:')) {
      title = line.replace('title:', '').replace(/"/g, '').trim();
    }
  });

  // Extract core Markdown body text (removing the frontmatter wrapper)
  const bodyContent = rawContent.replace(/^---[\s\S]*?---/, '').trim();

  console.log('📡 Fetching global subscriber list from Resend...');

  // 1. Fetch your global contact list
  const contactsResponse = await fetch('https://api.resend.com/contacts', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!contactsResponse.ok) {
    const err = await contactsResponse.json();
    console.error('❌ Failed to fetch subscriber contacts:', err);
    process.exit(1);
  }

  const contactsData = await contactsResponse.json();
  const subscribers = contactsData.data || [];

  if (subscribers.length === 0) {
    console.log('ℹ️ No subscribers found in your contacts list. Skipping broadcast.');
    return;
  }

  // Extract just the email addresses into an array
  const emailList = subscribers.map(contact => contact.email);

  console.log(`📡 Preparing broadcast for: "${title}" to ${emailList.length} subscribers...`);

  // 2. Trigger the broadcast to the extracted email array via Resend API
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Journal <newsletter@yourdomain.com>', // Update this with your verified domain later
      to: emailList, // Sends cleanly to your array of active subscribers
      subject: title,
      text: bodyContent,
    }),
  });

  if (response.ok) {
    console.log('🚀 Newsletter successfully broadcasted to all subscribers!');
  } else {
    const err = await response.json();
    console.error('❌ Broadcast failed:', err);
    process.exit(1);
  }
}

broadcast();