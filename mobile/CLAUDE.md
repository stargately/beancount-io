# Beancount Mobile - Claude Documentation

This file contains helpful information about the Beancount Mobile project for Claude Code sessions.

## Project Overview

Beancount Mobile Community Edition is a React Native app for iOS and Android built with Expo. It's a financial management app that connects to the Beancount.io service.

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: Apollo Client with reactive variables
- **Styling**: StyleSheet with custom theme system
- **Internationalization**: i18n-js with translations in 13 languages (English, Chinese, Bulgarian, Catalan, German, Spanish, Persian, French, Dutch, Portuguese, Russian, Slovak, Ukrainian)
- **Analytics**: Custom Mixpanel integration
- **Testing**: Use `yarn test` for lint and type checks

## Key Architecture

### Theme System

- Location: `src/common/theme/`, `src/common/providers/theme-provider/`
- Supports light, dark, and system themes
- Uses reactive variables for state management
- Theme provider listens to system appearance changes

### Translations

- Location: `src/translations/`
- Supported languages: en, zh, bg, ca, de, es, fa, fr, nl, pt, ru, sk, uk
- **IMPORTANT**: Use `useTranslations()` hook for reactive translations, not `i18n.t()` directly
- All translation files extend the English base with language-specific overrides
- Translation hook automatically re-renders components when language changes

### Common Commands

- `yarn test`: Run lint and type checks
- `yarn lint`: Run the linter
- `yarn start`: Start development server
- `yarn codegen`: Generate Apollo GraphQL schema types

## Important Files

### Configuration

- `app.json`: Expo configuration, app version is here
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration

### Key Directories

- `src/screens/`: Screen components
- `src/components/`: Reusable UI components
- `src/common/`: Shared utilities, hooks, themes
- `app/`: Expo Router file-based routing

### Theme-Related

- `src/common/vars/theme.ts`: Theme type definitions and storage
- `src/common/theme/index.ts`: Theme definitions and system detection
- `src/common/providers/theme-provider/`: Theme context provider

## Common Patterns

### Accessing Theme

```typescript
import { useTheme } from "@/common/theme";
const theme = useTheme().colorTheme;
```

### Using Reactive Variables

```typescript
import { useReactiveVar } from "@apollo/client";
import { themeVar } from "@/common/vars";
const currentTheme = useReactiveVar(themeVar);
```

### Using Translations (Reactive)

```typescript
import { useTranslations } from "@/common/hooks/use-translations";
const { t } = useTranslations();
// Use t("key") instead of i18n.t("key") for reactive translations
```

### Screen Structure

Most screens follow this pattern:

- Import theme and utilities
- Use analytics tracking on mount
- Apply theme-aware styling
- Use SafeAreaView for proper spacing

### Navigation

- Uses Expo Router with file-based routing
- Stack navigation with theme-aware headers
- Screens in `app/` directory map to routes

## Recent Changes

### Theme System Enhancement

- Added "system" option to follow device appearance
- Theme provider now listens for system appearance changes
- Settings screen uses picker instead of switch for theme selection
- Default theme changed from "light" to "system"

### Internationalization Expansion

- Extended support from 4 to 13 languages
- Added translations for: Bulgarian, Catalan, German, Persian, Dutch, Portuguese, Russian, Slovak, Ukrainian
- Updated language selector in settings to include all new locales
- All new translations extend English base with language-specific overrides

### Bug Fixes

- Fixed account picker screen flickering in dark mode by adding proper background colors
- Fixed version display in settings by using `Constants.expoConfig?.version`
- Removed unnecessary arrow from version display (non-clickable item)
- Fixed typo: "Locatization" → "Localization" in translations index

### Language Switching Reactivity Fix

- **Problem**: Components using `i18n.t()` directly weren't updating when language changed
- **Solution**: Created `useTranslations()` hook that uses reactive variables
- **Fixed Components**: Home screen, Settings, Auth screens, Add Transaction, Referral, Charts
- **Implementation**: Hook listens to `localeVar` changes and triggers re-renders automatically
- **Usage**: Replace `i18n.t("key")` with `const { t } = useTranslations(); t("key")`

## Development Notes

- Always use theme-aware colors (`theme.white`, `theme.black`, etc.)
- **Always use `useTranslations()` hook instead of `i18n.t()` for reactive translations**
- Follow existing component patterns when creating new UI
- Add proper TypeScript types
- Use existing translation keys or add new ones to all language files
- Test in both light and dark themes
- Ensure proper background colors for loading states
- Test language switching to verify translations update instantly
- **For temporary files**: Use the `/tmp` directory at the repository root (gitignored) for any temporary files, scripts, or artifacts needed during development

## Repository Info

- Original repo: `stargately/beancount-mobile`
- Uses GitHub Actions for CI/CD (lint workflow)
- MIT licensed
