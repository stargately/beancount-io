---
name: beancount-init
description: >-
  Scaffold a brand-new beancount + fava personal ledger repository in the
  current working directory. Creates main.bean (with the five root accounts
  opened today), a Makefile whose `make start` boots Fava on a randomized
  unusual port, an initialized uv Python project with beancount and fava
  installed, and a .gitignore tuned for Python/uv/fava. Trigger this skill
  whenever the user types /beancount-init, or asks to "set up a new
  beancount repo", "scaffold a beancount ledger", "start a new ledger",
  "bootstrap fava", "initialize a beancount project", or anything similar
  about beginning a fresh accounting repository. Do NOT trigger for
  questions about an existing ledger or for editing transactions.
---

# beancount-init

Scaffold a fresh beancount + fava ledger in the current working directory. Goal: from empty dir to running Fava in two commands (`/beancount-init`, then `make start`).

Run the steps in order. Stop if a preflight check fails — partial scaffolding is worse than no scaffolding.

## Step 1 — Preflight

Run `pwd && ls -A` to see the working directory.

**Hard-refuse** if any of these already exist: `main.bean`, `pyproject.toml`, `Makefile`. Print which ones are present and stop. Do not overwrite — the user almost certainly didn't mean to scaffold over an existing project.

If the directory contains other files but none of those markers, warn the user and ask once for confirmation before continuing.

Verify `uv` is on PATH with `command -v uv`. If it isn't, stop and tell the user to install it:

- macOS: `brew install uv`
- Otherwise: `curl -LsSf https://astral.sh/uv/install.sh | sh`

## Step 2 — Pick a random port

Run this once and capture stdout:

```
python3 -c "import random; bad={50000,55555,60000,65000}; ps=[p for p in range(49152,65536) if p not in bad and p%1000]; print(random.choice(ps))"
```

That gives an integer in IANA dynamic range (49152–65535), excluding round thousands and a few obvious "memorable" values. Each scaffolded ledger gets a different port — useful when running multiple ledgers concurrently. Call this value `PORT`.

If `python3` is somehow not available (very rare on macOS):

```
awk 'BEGIN{srand(); print 49152 + int(rand()*16384)}'
```

## Step 3 — Capture today's date

Run `date +%Y-%m-%d` and call the result `TODAY`. Used as the open-date for all root accounts.

## Step 4 — Initialize the uv project

```
uv init --bare
uv add fava beancount
```

`--bare` skips the `hello.py` / `README.md` / `src/` boilerplate that doesn't belong in a ledger repo. The two commands produce `pyproject.toml` and `uv.lock` and download fava and beancount into `.venv/`.

## Step 5 — Write `main.bean`

Substitute `{{TODAY}}` with the date from Step 3:

```
option "title" "Personal Ledger"
option "operating_currency" "USD"

{{TODAY}} open Assets:Cash USD
{{TODAY}} open Liabilities:CreditCard USD
{{TODAY}} open Income:Salary USD
{{TODAY}} open Expenses:Food USD
{{TODAY}} open Equity:Opening-Balances
```

The `Equity:Opening-Balances` line is deliberately currency-unconstrained — beancount convention so opening-balance entries can mix currencies later.

## Step 6 — Write `Makefile`

Substitute `{{PORT}}` with the integer from Step 2. **The recipe line must be tab-indented**, not spaces — `make` rejects spaces with a "missing separator" error. Write the file verbatim; do not re-format.

```
.PHONY: start
PORT ?= {{PORT}}

start:
	uv run fava main.bean -p $(PORT)
```

`PORT ?=` lets users override at runtime — e.g., `make start PORT=49999` if the baked-in port collides with something later.

## Step 7 — Write `.gitignore`

Overwrite whatever `uv init --bare` may have written. Sections cover Python, macOS, Linux, JetBrains IDEs, VS Code, and Fava — the entries every personal repo on a mac with a JetBrains/VS Code setup tends to need:

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
dist/
*.egg-info/
.eggs/
.pytest_cache/
.mypy_cache/
.ruff_cache/
.coverage
htmlcov/
.tox/
.venv/
venv/
env/

# macOS
.DS_Store
.AppleDouble
.LSOverride
._*
.Spotlight-V100
.Trashes

# Linux
*~
.fuse_hidden*
.directory
.Trash-*
.nfs*

# JetBrains
.idea/
*.iml
*.iws
*.ipr
out/

# VS Code
.vscode/
*.code-workspace
.history/

# Fava
.fava/
```

`uv.lock` and `pyproject.toml` are intentionally tracked — reproducible installs and dep declarations both belong in version control.

## Step 8 — `git init` (only if needed)

If `.git/` does not already exist, run `git init`. Don't stage anything — the user should review the scaffold before committing. If `.git/` already exists, skip silently.

## Step 9 — Report

Print to the user:

- Files created (e.g., `main.bean`, `Makefile`, `.gitignore`, `pyproject.toml`, `uv.lock`, plus `.git/` and `.venv/` if just created).
- The chosen port.
- Next step: run `make start`, then open `http://localhost:<PORT>` in a browser.

Keep the report tight — one short line per item, no narration.
