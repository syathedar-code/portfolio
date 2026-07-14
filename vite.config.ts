import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

const getGitMeta = (command: string) => {
  try {
    return execSync(command).toString().trim();
  } catch {
    return '';
  }
};

// Calculate uptime days dynamically at compilation execution
const launchDate = new Date("2026-07-12");
const uptimeDays = Math.floor((Date.now() - launchDate.getTime()) / (1000 * 60 * 60 * 24));
const uptimeString = `${Math.max(0, uptimeDays)} days`;

export default defineConfig({
  plugins: [react()],
  define: {
    __COMMIT_HASH__: JSON.stringify(getGitMeta('git rev-parse --short HEAD') || '39b115d'),
    __COMMIT_MSG__: JSON.stringify(getGitMeta('git log -1 --pretty=format:%s') || 'update payload logs'),
    __COMMIT_DATE__: JSON.stringify(getGitMeta('git log -1 --pretty=format:%cI') || new Date().toISOString()),
    __UPTIME__: JSON.stringify(uptimeString),
  }
});