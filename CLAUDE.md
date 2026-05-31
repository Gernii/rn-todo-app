# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Expo Docs

Before writing any Expo code, read the versioned docs at https://docs.expo.dev/versions/v56.0.0/

## Monorepo Structure

Turborepo monorepo with npm workspaces. The only app currently present is `apps/mobile` (React Native / Expo). A `backend` workspace is referenced in `package.json` but not yet created.

## Commands

All commands run from the repo root unless noted.

**Mobile dev (starts i18n watch + Expo):**

```sh
npm run dev                          # turbo dev (all apps)
cd apps/mobile && npm run android    # i18n watch + expo run:android
cd apps/mobile && npm run ios        # i18n watch + expo run:ios
```

**Tests:**

```sh
npm test                             # turbo test (all)
cd apps/mobile && npm test           # jest only
cd apps/mobile && npx jest path/to/file.test.tsx   # single test file
cd apps/mobile && npm run test.coverage
```

**Lint / Format (Biome):**

```sh
npm run biome.check                  # check only
npm run biome.fix                    # auto-fix (unsafe)
```

**i18n compilation:**

```sh
cd apps/mobile && npm run i18n.build  # one-shot compile
cd apps/mobile && npm run i18n.watch  # watch mode (dev)
```

**Commits:** use `npm run commit` (czg interactive prompt) — scopes are `app-backend` and `app-mobile`.

## Mobile App Architecture (`apps/mobile`)

Follows **Feature Sliced Design** with three layers under `src/`:

- `app/` — Expo Router file-based routes. Each file here is a screen. `_layout.tsx` is the root layout (theme, navigation theme, i18n key).
- `pages/` — Page-level feature modules. Each page folder contains a `ui/` sub-folder with `page.tsx` (the feature component) and co-located tests. The `index.ts` re-exports the page for the `app/` layer to use.
- `shared/` — Cross-cutting reusables:
  - `shared/ui/` — UI primitives (Button, Text, Icon, Select, NativeOnlyAnimatedView). Components use CVA for variants and the `cn()` utility.
  - `shared/lib/utils/cn.ts` — `cn()` = `twMerge(clsx(...))`.
  - `shared/lib/storage/mmkv.ts` — MMKV instances: `globalStorage` (app-wide) and a lazy per-user storage. Also exports Zustand `StateStorage` adapters (`globalZustandStorage`, `dynamicZustandStorage`).
  - `shared/lib/i18n/` — **Auto-generated** Paraglide JS output. Do not edit manually; source is `messages/en.json` and `messages/vi.json`.
  - `shared/config/i18n/model/useLanguageStore.ts` — Zustand store that drives locale switching; wires Paraglide's `overwriteGetLocale`/`overwriteSetLocale` and persists to MMKV.

**Path alias:** `@/` maps to `apps/mobile/src/`.

## Styling

[Uniwind](https://uniwind.dev) (Tailwind CSS for React Native) replaces StyleSheet. Classes work like Tailwind but target RN's layout system. Theme tokens (`light`/`dark`) are declared in `src/uniwind-types.d.ts` (auto-generated — do not edit). Use `Platform.select()` for web-specific classes inside component style objects.

Component variants are defined with **CVA** (`cva` package). See `shared/ui/button/styles.ts` for the pattern: one `cva()` call for the container and one for text, with `variant` and `size` axes. `TextClassContext` propagates text styles from parent containers (e.g., Button → Text).

## i18n

Translations live in `apps/mobile/messages/en.json` and `vi.json`. Message keys are generated IDs (e.g., `stock_large_bullock_bake`). After editing message files, run `npm run i18n.build` (or use `i18n.watch` during dev) to regenerate `src/shared/lib/i18n/`.

Import messages as: `import * as m from "@/shared/lib/i18n/messages"` then call `m.some_key_name()`.

## State Management

Zustand is the store library. Stores that need persistence use MMKV adapters from `shared/lib/storage/mmkv.ts` — use `globalZustandStorage` for app-wide data and `dynamicZustandStorage` for per-user data (only valid after `initializeUserStorage(userId)` is called).

## Linting Rules

Biome handles both formatting and linting. Config in root `biome.jsonc`: tabs for indentation, double quotes for JS/TS strings. Pre-commit runs `biome check --write --unsafe` via lint-staged, plus gitleaks for secret scanning.

## Expo

@AGENTS.md

## Test

Always mock import to isolate unit test. following mock-to-isolate pattern

Always only use en language in every test.

```
import { overwriteGetLocale } from "@/shared/lib/i18n/runtime";

overwriteGetLocale(() => "en");
```

Only use `userEvent`, NOT `fireEvent`
