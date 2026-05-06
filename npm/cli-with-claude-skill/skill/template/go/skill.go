// Package skill embeds the CLI's skill markdown so it can be installed
// into ~/.claude/skills/<tool>/SKILL.md and auto-updated on version bumps.
//
// Drop this file at `internal/skill/skill.go` alongside `internal/skill/skill.md`.
package skill

import _ "embed"

//go:embed skill.md
var Embedded string
