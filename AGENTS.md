# AGENTS.md

## Stack

- Next.js 16 (React 19, App Router)
- Tailwind CSS v4 + shadcn/ui (style: `base-vega`)
- MDX via `@next/mdx` with `mdxRs` experimental
- Shiki for syntax highlighting (transpiled from `shiki`)
- Biome for linting/formatting (NOT ESLint/Prettier)
- Redis for production view counting

## Dev Commands

```bash
bun dev      # Next.js dev (uses Turbopack)
bun run build    # next build
bun run lint     # next lint
bun run format   # biome format --write
```

Run order: `format` then `lint`.

## Key Quirks

- Biome ignores `*.mdx`, `*.css`, `*.md` — do not add lint/format comments for these
- `incrementGlobalView` in `lib/actions.ts` is a Server Action; it silently no-ops in dev (`NODE_ENV !== "production"`)
- Redis only connects in production if `REDIS_URL` env var is set
- `/posts/:slug` redirects to `/writings/:slug` (next.config.ts redirects)
- Mermaid and KaTeX are used in MDX content files
- Sessions use a `session_id` cookie set in `lib/session.ts`

## Code Style

- Biome: tabs for indentation, double quotes, `recommended` rules enabled
- shadcn/ui components use `class-variance-authority` (CVA)
- Path alias: `@/*` maps to project root

## Architecture

- `app/` — Next.js App Router pages and layouts
- `components/` — UI components (shadcn in `components/ui/`)
- `lib/` — Utilities, Redis, session, date helpers
- Content lives in `app/**/_timeline/` and `app/**/_articles/` (MDX)
- `public/` — Static assets

## env

- `REDIS_URL` — required for production view counting; absent in dev
- `.env.local` exists — do not commit secrets