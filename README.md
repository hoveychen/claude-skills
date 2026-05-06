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

```
/plugin install cli-with-claude-skill@hoveychen-claude-skills
```

See [plugins/cli-with-claude-skill/skills/cli-with-claude-skill/SKILL.md](plugins/cli-with-claude-skill/skills/cli-with-claude-skill/SKILL.md).

## Repo layout

```
claude-skills/
├── .claude-plugin/
│   └── marketplace.json          ← marketplace catalog
└── plugins/
    └── cli-with-claude-skill/
        ├── .claude-plugin/
        │   └── plugin.json       ← plugin manifest
        └── skills/
            └── cli-with-claude-skill/
                ├── SKILL.md
                └── template/     ← per-language reference templates
```

## License

MIT.
