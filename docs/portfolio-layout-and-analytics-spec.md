# Portfolio layout and analytics

## Public site shell

- Preserve the portfolio's typography, colors, personality, routes, and existing MDX information.
- Replace the side navigation with a fixed, icon-only bottom dock: portrait Home, Projects, Timeline, Writings, and Sound.
- Sound starts enabled, persists locally, and is limited to deliberate interaction cues.
- Use a centered editorial layout, subtle paper/dither ambience, and a three-part footer for colophon, contacts, and route index.
- The homepage contains the existing introduction and portrait, three destination cards, and numbered sections for existing GitHub, skills, social, résumé, and view-count material.

## Collections and MDX

- Projects and Timeline use compact single-column rows with icons.
- Writings are grouped by year.
- Writings, Projects, and Timeline share a narrow editorial MDX shell with category-specific metadata plates.
- Port Cali-style route-aware MDX rendering while retaining `@next/mdx`.
- Content images use colocated, dimensioned references under `public/content/{kind}/{slug}`; append `:crisp` to the `#WIDTHxHEIGHT` contract for technical diagrams.
- Meaningful covers and inline photography use dither, reveal, zoom, and sound; technical diagrams, logos, code, and tables remain crisp.
- Qualifying detail pages have a responsive content rail and all detail pages have previous, next, and collection-index navigation.

## Analytics

- Collect visible route views through `POST /api/analytics/view`.
- Deduplicate unique visitors by anonymous first-party cookie, with a daily HMAC of the IP only when the cookie is unavailable.
- Store aggregate-only analytics in Redis: views, HyperLogLog range uniques, daily trend, routes, referring domains, devices, and the existing all-time total.
- Accept analytics only for the portfolio's known public routes and apply a short per-visitor ingestion limit.
- Deduplication keys expire after 48 hours; daily aggregates expire after 100 days; all-time views persist.
- Never retain raw IPs, full user agents, full referrer URLs, fingerprints, or individual histories.
- Expose summaries through owner-only `GET /api/admin/analytics?range=7d|30d|90d`.
- Protect `/admin` and `/api/admin/*` with GitHub OAuth restricted to the configured `thaletto` owner.
- Admin uses a dedicated, noindex operational shell without the public dock or footer.
