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

### anthropic-launch-video

Playbook for producing Anthropic-style product launch / intro videos in [Remotion](https://www.remotion.dev/) (cream + coral + Fraunces serif + JetBrains Mono terminal aesthetic). Encodes both the visual language (color tokens, typography, grid) and the editing logic (trailing-word reveal, mouse-as-narrator, form morph, agent spinner→check, live diff typing, outro pacing).

Iron-rule discipline: confirm Player vs mp4 before scaffolding, validate which layer (style / editing / both) the user wants reproduced, dense 4fps reference frame extraction, and mandatory ffmpeg self-check on every render.

**Via Claude Code plugin marketplace:**
```
/plugin install anthropic-launch-video@hoveychen-claude-skills
```

**Via npm (alternative):**
```
npx @hoveychen/anthropic-launch-video install-claude-skill
```

Both routes write to `~/.claude/skills/anthropic-launch-video/`. See [plugins/anthropic-launch-video/skills/anthropic-launch-video/SKILL.md](plugins/anthropic-launch-video/skills/anthropic-launch-video/SKILL.md).

## Repo layout

```
claude-skills/
├── .claude-plugin/
│   └── marketplace.json                    ← marketplace catalog
├── plugins/
│   ├── cli-with-claude-skill/
│   │   ├── .claude-plugin/plugin.json
│   │   └── skills/cli-with-claude-skill/
│   │       ├── SKILL.md                    ← canonical source
│   │       └── template/                   ← per-language reference templates
│   └── anthropic-launch-video/
│       ├── .claude-plugin/plugin.json
│       └── skills/anthropic-launch-video/
│           └── SKILL.md                    ← canonical source
└── npm/                                    ← one self-installer npm package per skill
    ├── cli-with-claude-skill/              ← @hoveychen/cli-with-claude-skill
    │   ├── package.json
    │   ├── bin/cli.js
    │   ├── scripts/sync-skill.js           ← copies plugins/.../<skill>/* → skill/
    │   └── skill/                          ← synced copy of canonical source (do not edit)
    └── anthropic-launch-video/             ← @hoveychen/anthropic-launch-video
        ├── package.json
        ├── bin/cli.js
        ├── scripts/sync-skill.js
        └── skill/
```

**Source-of-truth**: edit `plugins/<skill>/skills/<skill>/`. Run `cd npm/<skill> && npm run sync-skill` to refresh the npm-bundled copy. Each npm package's `prepublishOnly` script runs sync automatically before publish.

## License

MIT.
