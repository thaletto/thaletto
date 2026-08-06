# cali.so

Source for [Cali Castle's personal site](https://cali.so). The v3 source
release reached `main` on July 20, 2026 and was subsequently migrated to an
English-only site focused on blog posts and a projects portfolio.

This repository documents and builds cali.so itself. It is not maintained as a
general-purpose blog template.

## Architecture

- Next.js 16 preview, React 19, TypeScript, and Tailwind CSS v4
- shadcn/ui (`@fluid` registry) primitives with Base UI
- MDX posts and colocated media under `content/blog/`
- Project content under `content/projects/` with per-project pages
- Static public pages with committed fallback snapshots (`content/social.json`,
  `content/github.json`, `content/link-previews.json`) refreshed by scripts
- CSP, same-origin mutation checks, and production dependency auditing

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

Run the checks relevant to a change throughout development. Before release,
the full suite and production build must pass from a clean install.

```bash
bun run typecheck
bun run test:unit
bun run test:security
bun run test:deployment
bun run audit:prod
bun run build
```

Browser specs under `tests/browser/` run with `bun run test:browser`.

## Documentation

See `scripts/` for the content refresh utilities and `app/` for the route
tree. `lib/` holds the content loaders, security headers, SEO metadata, and
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
authored work under `content/blog/`, project materials under `content/projects/`,
personal media under `public/images/`, and biographical and taste data. A fork
must replace or omit these materials and supply its own identity, analytics
identifiers, credentials, and deployment settings.
