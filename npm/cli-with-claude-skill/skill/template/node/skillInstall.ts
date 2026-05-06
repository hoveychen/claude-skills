// Drop into your commander-based CLI.
//
// Project layout:
//   src/skill.md          (the embedded skill markdown)
//   src/skillInstall.ts   (this file)
//   src/cli.ts            (your commander entrypoint)
//
// Wire-up in cli.ts:
//
//   import { Command } from "commander";
//   import { registerSkillCommand, checkSkillNotice } from "./skillInstall.js";
//
//   const program = new Command();
//   program.name("mytool");
//   registerSkillCommand(program);
//   program.hook("preAction", () => checkSkillNotice());
//   // ...your other subcommands
//   program.parseAsync(process.argv);
//
// Replace `mytool` with your actual binary name.
//
// Bundling note: this file uses `fs.readFileSync` at module load to inline
// `skill.md`. If you ship via tsup/esbuild/etc, configure the bundler to
// copy `skill.md` next to the bundle, or switch to a plugin that inlines
// .md files at build time and assign EMBEDDED accordingly.

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { Command } from "commander";

export const TOOL_NAME = "mytool";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const EMBEDDED: string = fs.readFileSync(path.join(__dirname, "skill.md"), "utf8");

export function skillPath(): string {
  return path.join(os.homedir(), ".claude", "skills", TOOL_NAME, "SKILL.md");
}

export function parseVersion(content: string): string | null {
  const blocks = content.split("---");
  for (let i = 0; i < Math.min(blocks.length, 3); i++) {
    for (const line of blocks[i].split("\n")) {
      const t = line.trim();
      if (t.startsWith("version:")) {
        return t.slice("version:".length).trim();
      }
    }
  }
  return null;
}

export function parseSemver(v: string): [number, number, number] | null {
  let s = v.trim();
  if (s.startsWith("v")) s = s.slice(1);
  s = s.split(/[-+]/)[0];
  const parts = s.split(".");
  if (parts.length === 0 || parts.length > 3) return null;
  const out: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < parts.length; i++) {
    const n = Number(parts[i]);
    if (!Number.isInteger(n) || n < 0) return null;
    out[i] = n;
  }
  return out;
}

export function shouldShowOutdated(installed: string | null, embedded: string | null): boolean {
  if (!embedded) return false;
  if (!installed) return true;
  const a = parseSemver(installed);
  const b = parseSemver(embedded);
  if (!a || !b) return installed !== embedded;
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return b[i] > a[i];
  }
  return false;
}

export async function installClaudeSkill(): Promise<void> {
  const p = skillPath();
  await fs.promises.mkdir(path.dirname(p), { recursive: true, mode: 0o700 });
  await fs.promises.writeFile(p, EMBEDDED, { mode: 0o644 });
  console.log(`Claude Code skill installed at ${p}`);
}

export function checkSkillNotice(): void {
  let installed: string;
  try {
    installed = fs.readFileSync(skillPath(), "utf8");
  } catch {
    console.error(`Tip: Run \`${TOOL_NAME} install-claude-skill\` to add Claude Code skill support.`);
    return;
  }
  const installedV = parseVersion(installed);
  const embeddedV = parseVersion(EMBEDDED);
  if (shouldShowOutdated(installedV, embeddedV)) {
    console.error("Notice: Claude skill is outdated. Auto-updating...");
    installClaudeSkill().catch((e) => {
      console.error(`  failed: ${e}. Run \`${TOOL_NAME} install-claude-skill\` to update manually.`);
    });
  }
}

export function registerSkillCommand(program: Command): void {
  program
    .command("install-claude-skill")
    .description(`Install/update the Claude Code skill into ~/.claude/skills/${TOOL_NAME}/`)
    .action(async () => {
      await installClaudeSkill();
    });
}
