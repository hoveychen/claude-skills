// Drop this file into the cobra-based main package of your CLI.
//
// Wire-up checklist (in your main.go init / rootCmd setup):
//
//   rootCmd.AddCommand(installClaudeSkillCmd)
//
//   rootCmd.PersistentPreRun = func(cmd *cobra.Command, args []string) {
//       // ...your existing PersistentPreRun work...
//       checkSkillNotice()
//   }
//
// Replace `mytool` with your actual binary name and `<your-module>` with the
// Go module path that hosts internal/skill.
package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/spf13/cobra"

	"<your-module>/internal/skill"
)

const toolName = "mytool"

var embeddedSkill = skill.Embedded

func claudeSkillPath() string {
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".claude", "skills", toolName, "SKILL.md")
}

func parseSkillVersion(content string) string {
	for _, block := range strings.SplitN(content, "---", 3) {
		for _, l := range strings.Split(block, "\n") {
			l = strings.TrimSpace(l)
			if strings.HasPrefix(l, "version:") {
				return strings.TrimSpace(strings.TrimPrefix(l, "version:"))
			}
		}
	}
	return ""
}

func parseSemver(v string) ([3]int, bool) {
	var out [3]int
	v = strings.TrimPrefix(strings.TrimSpace(v), "v")
	if i := strings.IndexAny(v, "-+"); i >= 0 {
		v = v[:i]
	}
	parts := strings.Split(v, ".")
	if len(parts) == 0 || len(parts) > 3 {
		return out, false
	}
	for i, p := range parts {
		n, err := strconv.Atoi(p)
		if err != nil || n < 0 {
			return out, false
		}
		out[i] = n
	}
	return out, true
}

func shouldShowSkillOutdatedNotice(installed, embedded string) bool {
	if embedded == "" {
		return false
	}
	if installed == "" {
		return true
	}
	inst, instOK := parseSemver(installed)
	emb, embOK := parseSemver(embedded)
	if !instOK || !embOK {
		return installed != embedded
	}
	for i := 0; i < 3; i++ {
		if emb[i] != inst[i] {
			return emb[i] > inst[i]
		}
	}
	return false
}

func checkSkillNotice() {
	installedData, err := os.ReadFile(claudeSkillPath())
	if err != nil {
		fmt.Fprintf(os.Stderr, "Tip: Run `%s install-claude-skill` to add Claude Code skill support.\n", toolName)
		return
	}
	installedVersion := parseSkillVersion(string(installedData))
	embeddedVersion := parseSkillVersion(embeddedSkill)
	if shouldShowSkillOutdatedNotice(installedVersion, embeddedVersion) {
		fmt.Fprintln(os.Stderr, "Notice: Claude skill is outdated. Auto-updating...")
		if err := cmdInstallClaudeSkill(); err != nil {
			fmt.Fprintf(os.Stderr, "  failed: %v. Run `%s install-claude-skill` to update manually.\n", err, toolName)
		}
	}
}

func cmdInstallClaudeSkill() error {
	path := claudeSkillPath()
	if err := os.MkdirAll(filepath.Dir(path), 0700); err != nil {
		return fmt.Errorf("creating skill directory: %w", err)
	}
	if err := os.WriteFile(path, []byte(embeddedSkill), 0644); err != nil {
		return fmt.Errorf("writing skill file: %w", err)
	}
	fmt.Printf("Claude Code skill installed at %s\n", path)
	return nil
}

var installClaudeSkillCmd = &cobra.Command{
	Use:   "install-claude-skill",
	Short: "Install/update the Claude Code skill into ~/.claude/skills/" + toolName + "/",
	RunE: func(cmd *cobra.Command, args []string) error {
		return cmdInstallClaudeSkill()
	},
}
