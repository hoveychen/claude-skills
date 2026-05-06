# claude-skills

Yuheng's collection of [Claude Code](https://claude.com/claude-code) skills, distributed as a plugin marketplace.

## Install

In Claude Code:

```
/plugin marketplace add hoveychen/claude-skills
```

Then install any plugin from this hub:

```
/plugin install <plugin-name>@hoveychen-claude-skills
```

## Plugins

### cli-with-claude-skill

Discipline rules + Go / Rust / Node / Python reference templates for building CLI tools that embed and install their own Claude Code skill.

Solves the recurring failure modes: hand-parsed args, missing `install-claude-skill` command, missing `version:` field, embedded SKILL.md drifting from CLI surface, and editing the installed copy instead of the source.

**Via Claude Code plugin marketplace:**
```
/plugin install cli-with-claude-skill@hoveychen-claude-skills
```

**Via npm (alternative):**
```
npx @hoveychen/cli-with-claude-skill install-claude-skill
```

Pick one route — both write to `~/.claude/skills/cli-with-claude-skill/`. See [plugins/cli-with-claude-skill/skills/cli-with-claude-skill/SKILL.md](plugins/cli-with-claude-skill/skills/cli-with-claude-skill/SKILL.md).

## Repo layout

```
claude-skills/
├── .claude-plugin/
│   └── marketplace.json          ← marketplace catalog
├── plugins/
│   └── cli-with-claude-skill/
│       ├── .claude-plugin/
│       │   └── plugin.json       ← plugin manifest
│       └── skills/
│           └── cli-with-claude-skill/
│               ├── SKILL.md      ← canonical source
│               └── template/     ← per-language reference templates
└── npm/                          ← @hoveychen/cli-with-claude-skill npm package
    ├── package.json
    ├── bin/cli.js
    ├── scripts/sync-skill.js     ← copies plugins/.../cli-with-claude-skill/* → npm/skill/
    └── skill/                    ← synced copy of the canonical source (do not edit)
```

**Source-of-truth**: edit `plugins/cli-with-claude-skill/skills/cli-with-claude-skill/`. Run `cd npm && npm run sync-skill` to refresh the npm-bundled copy. The npm package's `prepublishOnly` script runs sync automatically before publish.

## License

MIT.
