# @hoveychen/cli-with-claude-skill

npm-flavoured installer for the [`cli-with-claude-skill`](https://github.com/hoveychen/claude-skills) [Claude Code](https://claude.com/claude-code) skill.

## What it does

Installs a Claude Code skill at `~/.claude/skills/cli-with-claude-skill/` containing discipline rules + Go / Rust / Node / Python reference templates for CLI tools that embed and install their own Claude Code skill.

## Use

One-shot:

```
npx @hoveychen/cli-with-claude-skill install-claude-skill
```

Or globally:

```
npm install -g @hoveychen/cli-with-claude-skill
cli-with-claude-skill install-claude-skill
```

Confirm with:

```
ls ~/.claude/skills/cli-with-claude-skill/
```

## Alternative: Claude Code plugin marketplace

The same skill is also distributed via Claude Code's plugin system:

```
/plugin marketplace add hoveychen/claude-skills
/plugin install cli-with-claude-skill@hoveychen-claude-skills
```

Pick **one** route. Installing both will cause `~/.claude/skills/cli-with-claude-skill/` to be overwritten by whichever ran most recently. The content is identical either way.

## Source

[github.com/hoveychen/claude-skills](https://github.com/hoveychen/claude-skills) — canonical source for `SKILL.md` and templates. Issues and PRs welcome.

## License

MIT.
