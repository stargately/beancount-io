# Beancount.io Monorepo

Monorepo for [Beancount.io](https://beancount.io/) — double-entry bookkeeping made easy.

This file holds repo-wide rules. Per-package guidance lives next to the code:
- `mobile/CLAUDE.md` — React Native app

## Packages

| Path | Status | Description |
|------|--------|-------------|
| `mobile/` | active | React Native iOS/Android app (Expo, Apollo, TypeScript) |
| `skills/` | placeholder | Skills package — empty, only `.gitkeep` |
| `cli/` | placeholder | CLI tool — empty, only `.gitkeep` |

There is no root `package.json`. Each package owns its own dependencies, scripts, and `yarn.lock`. CI runs from inside `mobile/`.

When `skills/` or `cli/` get real code, add a `skills/CLAUDE.md` / `cli/CLAUDE.md` documenting their tech stack and conventions.

## Repo-wide rules

### Never modify any `yarn.lock`
- Each package owns its own `yarn.lock` (today, only `mobile/yarn.lock` exists).
- Lock files are managed by Yarn — manual edits cause dependency drift.
- If deps need updating, run `yarn install` / `yarn upgrade` from inside the package directory. Ask the user before adding new dependencies.

### Scope changes to one package
- Always `cd` into the package directory before running scripts (`yarn`, `tsc`, etc.).
- Don't introduce cross-package imports — packages are independent.
- If unsure which package a change belongs to, ask.

### Temporary files
- Use `mobile/tmp/` for scratch work while in the mobile package — it's gitignored.
- Don't drop scratch files at the repo root (there is no root `.gitignore`).
- Clean up when no longer needed.

## Tooling
- Node ≥ 20.
- Yarn 1.22.x (Classic) — pinned via `mobile/package.json`'s `packageManager`.
- CI: `.github/workflows/ci.yml` runs `yarn lint`, `yarn typecheck`, `yarn test:unit` inside `mobile/` on push/PR to `main`.
- Deploy: `.github/workflows/deploy.yml` triggers an Expo EAS build/submit when `mobile/package.json`'s `version` changes on `main`.
