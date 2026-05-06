"""Drop into your click-based CLI.

Project layout:
    mytool/skill.md            (the embedded skill markdown — packaged as data)
    mytool/skill_install.py    (this file)
    mytool/__main__.py         (your click entrypoint)

Wire-up in __main__.py:

    import click
    from .skill_install import install_claude_skill_cmd, check_skill_notice

    @click.group()
    def cli():
        check_skill_notice()  # startup hook

    cli.add_command(install_claude_skill_cmd)
    # ...your other subcommands

    if __name__ == "__main__":
        cli()

Packaging note: ensure ``skill.md`` is included as package data so
``importlib.resources`` can find it. In ``pyproject.toml`` (hatchling/setuptools):

    [tool.hatch.build.targets.wheel]
    packages = ["mytool"]
    [tool.hatch.build.targets.wheel.force-include]
    "mytool/skill.md" = "mytool/skill.md"

Replace ``mytool`` everywhere with your actual binary / package name.
"""

from __future__ import annotations

import os
from importlib import resources
from pathlib import Path

import click

TOOL_NAME = "mytool"


def _load_embedded() -> str:
    return resources.files(__package__).joinpath("skill.md").read_text(encoding="utf-8")


EMBEDDED: str = _load_embedded()


def skill_path() -> Path:
    return Path.home() / ".claude" / "skills" / TOOL_NAME / "SKILL.md"


def parse_version(content: str) -> str | None:
    for block in content.split("---", 2):
        for line in block.splitlines():
            stripped = line.strip()
            if stripped.startswith("version:"):
                return stripped[len("version:") :].strip()
    return None


def parse_semver(v: str) -> tuple[int, int, int] | None:
    s = v.strip()
    if s.startswith("v"):
        s = s[1:]
    for sep in ("-", "+"):
        if sep in s:
            s = s.split(sep, 1)[0]
    parts = s.split(".")
    if not parts or len(parts) > 3:
        return None
    out = [0, 0, 0]
    for i, p in enumerate(parts):
        if not p.isdigit():
            return None
        out[i] = int(p)
    return out[0], out[1], out[2]


def should_show_outdated(installed: str | None, embedded: str | None) -> bool:
    if not embedded:
        return False
    if not installed:
        return True
    a = parse_semver(installed)
    b = parse_semver(embedded)
    if a is None or b is None:
        return installed != embedded
    return b > a


def install_claude_skill() -> None:
    path = skill_path()
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    path.write_text(EMBEDDED, encoding="utf-8")
    click.echo(f"Claude Code skill installed at {path}")


def check_skill_notice() -> None:
    path = skill_path()
    try:
        installed = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        click.echo(
            f"Tip: Run `{TOOL_NAME} install-claude-skill` to add Claude Code skill support.",
            err=True,
        )
        return
    if should_show_outdated(parse_version(installed), parse_version(EMBEDDED)):
        click.echo("Notice: Claude skill is outdated. Auto-updating...", err=True)
        try:
            install_claude_skill()
        except OSError as e:
            click.echo(
                f"  failed: {e}. Run `{TOOL_NAME} install-claude-skill` to update manually.",
                err=True,
            )


@click.command(name="install-claude-skill")
def install_claude_skill_cmd() -> None:
    """Install/update the Claude Code skill into ~/.claude/skills/<tool>/."""
    install_claude_skill()
