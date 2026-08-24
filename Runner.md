# Runner — Running CKEditor 5 Locally

Steps to install dependencies and run the CKEditor 5 dev repo locally (the way it was done in this environment).

## Overview

This repo is a **pnpm monorepo** (61 packages under `packages/*`). There is **no single "app"** to launch — it's the editor framework plus build/test tooling. The way to *see the editor running in a browser* is the **manual test server**, which mounts live editor instances with live-reload.

## Requirements

- **Node.js** `>=24.11.0` (this environment: v24.16.0 ✓)
- **pnpm** `^11.8.0`
- **Git**

## 1. Get pnpm (via corepack)

`pnpm` was **not on PATH** here, but `corepack` (ships with Node) is available. Activate pnpm through it:

```bash
corepack prepare pnpm@11.10.0 --activate
```

> Note: The corepack shim may not put `pnpm` directly on PATH. If `pnpm` isn't found, prefix every pnpm command with `corepack`, e.g. `corepack pnpm install`. All commands below use that form.

Verify:

```bash
corepack pnpm --version   # -> 11.10.0
```

## 2. Switch to the working branch

```bash
git checkout uat
```

> There is no `dev` branch in this repo — only `main`, `master`, and `uat`.

## 3. Install dependencies

```bash
corepack pnpm install
```

- Takes ~3 minutes.
- Runs native build scripts for `sharp`, `esbuild`, `puppeteer`, etc.
- Links ~1170 packages and all workspace packages.

## 4. Run the editor (manual test server)

Serve the manual tests, scoped to one package for a fast startup:

```bash
corepack pnpm run manual --files=basic-styles --disable-watch
```

Then open:

**→ http://localhost:8125/**

The index page lists each manual test HTML file; each page mounts a **live CKEditor 5 instance** (with the CKEditor inspector attached).

### Useful flags

| Flag | Purpose |
|------|---------|
| `--files=<pkg[,pkg]>` | Scope to package(s), e.g. `--files=basic-styles,table,image`. **Omit to build ALL packages** (much slower). |
| `--disable-watch` | Disable auto-rebuild on file changes (faster/lighter). Drop it to get live-reload. |
| `--port <number>` | Change server port (default `8125`). |
| `--language <code>` / `--additional-languages <codes>` | Set UI language(s). |

See all options: `corepack pnpm run manual --help`

## 5. (Optional) Run tests

```bash
# watch + coverage + source-map, scoped to the engine package
corepack pnpm run test -- -wcs --files=engine
```

> The test stack was migrated to **Vitest + Vite** (browser tests via `@vitest/browser-playwright`).

## 6. (Optional) Build the documentation

```bash
corepack pnpm run docs        # output in build/docs/
corepack pnpm run docs:serve  # serves docs over HTTPS on port 8080
```

## Quick reference

```bash
corepack prepare pnpm@11.10.0 --activate   # get pnpm
git checkout uat                           # working branch
corepack pnpm install                      # deps (~3 min)
corepack pnpm run manual --files=basic-styles --disable-watch   # run -> http://localhost:8125/
```
