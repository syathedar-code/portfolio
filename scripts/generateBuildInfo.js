import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function run(command) {
    return execSync(command).toString().trim();
}

try {
    const commit = run("git rev-parse --short HEAD");
    const commitMessage = run("git log -1 --pretty=%s");
    const commitDateRaw = run("git log -1 --date=iso --pretty=%cd");

    const commitDate = new Date(commitDateRaw);

    const formattedDate = commitDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const formattedTime = commitDate.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    const launchDate = new Date("2026-07-12");

    const uptimeDays = Math.floor(
        (Date.now() - launchDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const buildInfo = `export const buildInfo = {
  commit: "${commit}",
  commitMessage: ${JSON.stringify(commitMessage)},
  commitDate: "${formattedDate}",
  commitTime: "${formattedTime}",
  uptime: "${uptimeDays} days",
};
`;

    const outDir = path.join(__dirname, "../src/generated");

    fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(
        path.join(outDir, "buildInfo.ts"),
        buildInfo
    );

    console.log("✅ buildInfo.ts generated");
} catch (err) {
    console.error(err);
}