//! Drop into your clap-based CLI.
//!
//! Project layout:
//!   src/skill.md            (the embedded skill markdown)
//!   src/skill_install.rs    (this file)
//!   src/main.rs             (your clap derive entrypoint)
//!
//! Wire-up in main.rs:
//!
//!   mod skill_install;
//!   use clap::{Parser, Subcommand};
//!
//!   #[derive(Parser)]
//!   #[command(name = "mytool")]
//!   struct Cli { #[command(subcommand)] command: Commands }
//!
//!   #[derive(Subcommand)]
//!   enum Commands {
//!       /// Install/update the Claude Code skill into ~/.claude/skills/mytool/
//!       InstallClaudeSkill,
//!       // ...your other subcommands
//!   }
//!
//!   fn main() {
//!       skill_install::check_notice();          // startup hook (missing → tip; outdated → auto-update)
//!       let cli = Cli::parse();
//!       match cli.command {
//!           Commands::InstallClaudeSkill => skill_install::install().unwrap(),
//!           // ...
//!       }
//!   }
//!
//! Replace `mytool` everywhere with your actual binary name.
//!
//! Cargo.toml dependency: `dirs = "5"` (for home-dir lookup).

use std::fs;
use std::io::Write;
use std::path::PathBuf;

pub const TOOL_NAME: &str = "mytool";

pub const EMBEDDED: &str = include_str!("skill.md");

pub fn skill_path() -> PathBuf {
    let home = dirs::home_dir().expect("home dir");
    home.join(".claude").join("skills").join(TOOL_NAME).join("SKILL.md")
}

/// Returns the value after `version:` in the YAML frontmatter, or None.
pub fn parse_version(content: &str) -> Option<String> {
    for block in content.splitn(3, "---") {
        for line in block.lines() {
            let line = line.trim();
            if let Some(rest) = line.strip_prefix("version:") {
                return Some(rest.trim().to_string());
            }
        }
    }
    None
}

/// Parse `[major, minor, patch]` from a version string. Accepts `1`, `1.2`, `1.2.3`, optional `v` prefix.
pub fn parse_semver(v: &str) -> Option<[u32; 3]> {
    let v = v.trim();
    let v = v.strip_prefix('v').unwrap_or(v);
    let v = v.split(|c| c == '-' || c == '+').next()?;
    let parts: Vec<&str> = v.split('.').collect();
    if parts.is_empty() || parts.len() > 3 {
        return None;
    }
    let mut out = [0u32; 3];
    for (i, p) in parts.iter().enumerate() {
        out[i] = p.parse().ok()?;
    }
    Some(out)
}

pub fn should_show_outdated(installed: Option<&str>, embedded: Option<&str>) -> bool {
    let Some(emb) = embedded else { return false };
    let Some(inst) = installed else { return true };
    match (parse_semver(inst), parse_semver(emb)) {
        (Some(a), Some(b)) => b > a,
        _ => inst != emb,
    }
}

pub fn check_notice() {
    let path = skill_path();
    let installed = match fs::read_to_string(&path) {
        Ok(s) => s,
        Err(_) => {
            eprintln!("Tip: Run `{} install-claude-skill` to add Claude Code skill support.", TOOL_NAME);
            return;
        }
    };
    let installed_v = parse_version(&installed);
    let embedded_v = parse_version(EMBEDDED);
    if should_show_outdated(installed_v.as_deref(), embedded_v.as_deref()) {
        eprintln!("Notice: Claude skill is outdated. Auto-updating...");
        if let Err(e) = install() {
            eprintln!("  failed: {}. Run `{} install-claude-skill` to update manually.", e, TOOL_NAME);
        }
    }
}

pub fn install() -> std::io::Result<()> {
    let path = skill_path();
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    let mut f = fs::File::create(&path)?;
    f.write_all(EMBEDDED.as_bytes())?;
    println!("Claude Code skill installed at {}", path.display());
    Ok(())
}
