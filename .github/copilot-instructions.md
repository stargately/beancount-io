# GitHub Copilot Instructions

## File Modification Rules

### Never Modify yarn.lock

**IMPORTANT**: Do not modify, update, or regenerate any `yarn.lock` file under any circumstances.

- Each package manages its own `yarn.lock` (currently `mobile/yarn.lock`)
- The `yarn.lock` file is automatically managed by the Yarn package manager
- Manual or automated changes to this file can cause dependency inconsistencies
- If dependencies need to be updated, ask the developer to run `yarn install` or `yarn upgrade` from within the relevant package directory
- Never suggest changes to `yarn.lock` in code suggestions or completions

## Project Context

This is a monorepo with three packages:

- **`mobile/`** — React Native app built with Expo. Uses Expo Router for file-based navigation, Apollo Client for GraphQL, and TypeScript with path alias `@/*` → `src/*`.
- **`skills/`** — Skills package (in development).
- **`cli/`** — CLI tool (in development).

When making suggestions or generating code:
- Always scope changes to the correct package directory
- Follow existing TypeScript patterns and conventions in each package
- Respect the project's dependency management through Yarn
- Do not modify lock files or package manager configuration

## Temporary Files

When creating temporary files, scripts, or artifacts during development:
- Use the `/tmp` directory at the repository root
- This directory is gitignored and safe for temporary work
- Clean up temporary files when they're no longer needed
