---
description: Generates a commit message from staged (or unstaged) changes.
argument-hint: [optional context...]
allowed-tools: Bash(git diff:*)
---

# Task: Generate a Conventional Commit Message

Based on the following code changes, please generate a concise and descriptive commit message that follows the Conventional Commits specification.

Provide only the commit message itself, without any introduction or explanation.

- If it contains frontend changes, then briefly describe UI before / after the change.
- !!Important!! Never mention `Generated with Claude Code` or `Co-Authored-By`

## Staged Changes:

```
!git diff --cached
```

## Unstaged Changes:

```
!git diff
```

## Optional User Context:

$ARGUMENTS
