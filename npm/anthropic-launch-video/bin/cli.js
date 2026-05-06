#!/usr/bin/env node
import { Command } from "commander";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const TOOL_NAME = "anthropic-launch-video";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const SKILL_SRC_DIR = path.join(PKG_ROOT, "skill");

function skillInstallDir() {
  return path.join(os.homedir(), ".claude", "skills", TOOL_NAME);
}

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

async function installClaudeSkill() {
  if (!fs.existsSync(SKILL_SRC_DIR)) {
    throw new Error(`Bundled skill content missing at ${SKILL_SRC_DIR}. If running from a git checkout, run 'npm run sync-skill' first.`);
  }
  const dest = skillInstallDir();
  await fs.promises.mkdir(path.dirname(dest), { recursive: true, mode: 0o700 });
  await fs.promises.rm(dest, { recursive: true, force: true });
  await copyDir(SKILL_SRC_DIR, dest);
  console.log(`Claude Code skill installed at ${dest}`);
}

const pkg = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, "package.json"), "utf8"));

const program = new Command();
program
  .name(TOOL_NAME)
  .description("Install the anthropic-launch-video Claude Code skill into ~/.claude/skills/")
  .version(pkg.version);

program
  .command("install-claude-skill")
  .description(`Install/update the skill into ~/.claude/skills/${TOOL_NAME}/`)
  .action(async () => {
    try {
      await installClaudeSkill();
    } catch (e) {
      console.error(`Error: ${e.message}`);
      process.exit(1);
    }
  });

await program.parseAsync(process.argv);
