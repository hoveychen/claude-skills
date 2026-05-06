// Syncs the canonical plugin's skill content into ./skill/ so it can be
// bundled when this package is published.
//
// Canonical source: <repo>/plugins/anthropic-launch-video/skills/anthropic-launch-video/
// Synced copy:      <repo>/npm/anthropic-launch-video/skill/

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "plugins",
  "anthropic-launch-video",
  "skills",
  "anthropic-launch-video",
);
const DEST = path.resolve(__dirname, "..", "skill");

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  for (const entry of await fs.promises.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d);
    } else {
      await fs.promises.copyFile(s, d);
    }
  }
}

if (!fs.existsSync(SRC)) {
  console.error(`sync-skill: canonical source not found at ${SRC}`);
  process.exit(1);
}

await fs.promises.rm(DEST, { recursive: true, force: true });
await copyDir(SRC, DEST);
console.log(`sync-skill: ${SRC} -> ${DEST}`);
