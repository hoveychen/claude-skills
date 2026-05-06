---
name: REPLACE_WITH_TOOL_NAME
version: 1
description: Use when REPLACE WITH TRIGGERING CONDITIONS (see ~/.claude/skills/skill-description-cso/SKILL.md — describe WHEN, not WHAT)
---

# REPLACE_WITH_TOOL_NAME — one-line tagline

## Installation

```bash
# Replace with your actual install one-liner / download instructions.
curl -fsSL https://example.com/install.sh | sh
```

## Subcommands

Document every subcommand below. Each entry: 1-line purpose, flags, one usage example.

### `REPLACE_WITH_TOOL_NAME login`

(purpose, flags, example)

### `REPLACE_WITH_TOOL_NAME install-claude-skill`

Install or update this skill into `~/.claude/skills/REPLACE_WITH_TOOL_NAME/SKILL.md`. The CLI also auto-runs this on startup when the installed copy is older than the embedded `version:`.

```bash
REPLACE_WITH_TOOL_NAME install-claude-skill
```

## Notes

- Source-of-truth for THIS file is in the CLI's repo (e.g. `internal/skill/skill.md`). Editing the installed copy at `~/.claude/skills/REPLACE_WITH_TOOL_NAME/SKILL.md` is wasted work — it will be overwritten on the next startup.
- Bump `version:` above whenever you change this file.
