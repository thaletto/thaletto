# cali.so

Source for [Cali Castle's personal site](https://cali.so). The v3 source
release reached `main` on July 20, 2026 and was subsequently migrated to an
English-only site focused on blog posts and a projects portfolio.

This repository documents and builds cali.so itself. It is not maintained as a
general-purpose blog template.

## Architecture

- Next.js 16 preview, React 19, TypeScript, and Tailwind CSS v4
- shadcn/ui (`@fluid` registry) primitives with Base UI
- MDX posts and colocated media under `src/content/blog/`
- Project content under `src/content/projects/` with per-project pages
- Static public pages with committed fallback snapshots (`src/content/social.json`,
  `src/content/github.json`) refreshed by the build's prebuild hook
- CSP and same-origin mutation checks

## Local development

Use the bun version declared in `package.json` and isolated development
credentials. Never copy production data or secrets into a local environment.

```bash
bun install
cp .env.example .env.local
bun dev
```

`.env.example` documents the runtime variables. The only required variable is
`PUBLIC_SITE_URL`; outside local development it must be an HTTPS URL.

## Validation

Run the formatter, linter, TypeScript typecheck, and a production build for
any change:

```bash
bun run format   # biome format --write
bun run lint     # biome lint (reports; design-coded rules are documented in biome.jsonc)
bunx tsc --noEmit
bun run build
```

`bun run build` first runs the `prebuild` hook, which best-effort refreshes the
committed GitHub snapshot (`src/content/github.json`) from live data before the
build bakes the pages.

## Documentation

See `src/scripts/` for the content refresh utilities and `src/app/` for the route
tree. `src/lib/` holds the content loaders, security headers, SEO metadata, and
site data. Commit messages and PR descriptions document release history.

## Release history

- **v3.0** (July 20, 2026): ground-up, repository-owned source release
  promoted through PR #195 and described by issue #98
- **v2.0** (2024-03-13): legacy Sanity and Next.js 14 site
- **v1.1** (2024-03-10): migrated the legacy database from PlanetScale to Neon

## License and content rights

Original application source code is available under the [MIT License](LICENSE).
The MIT grant does not cover Cali's personal writing, photographs, artwork,
identity, likeness, logos, branding, personal data, or third-party assets.
Those materials remain subject to their respective rights and may not be
reused except with separate permission or as allowed by law. Examples include
authored work under `src/content/blog/`, project materials under `src/content/projects/`,
personal media under `public/images/`, and biographical and taste data. A fork
must replace or omit these materials and supply its own identity, analytics
identifiers, credentials, and deployment settings.
