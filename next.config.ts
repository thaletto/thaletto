import type { NextConfig } from 'next'

import legacyUrlManifest from './content/legacy-url-manifest.json'
import { securityHeaders } from './lib/security/headers'

const legacyRedirects = legacyUrlManifest.entries.flatMap((entry) =>
  entry.kind === 'redirect' && typeof entry.destination === 'string'
    ? [
        {
          source: entry.source,
          destination: entry.destination,
          permanent: true,
        },
      ]
    : [],
)

const legacyRewrites = legacyUrlManifest.entries.flatMap((entry) =>
  entry.kind === 'rewrite' && typeof entry.destination === 'string'
    ? [{ source: entry.source, destination: entry.destination }]
    : [],
)

const ogRuntimeAssets = [
  './app/_fonts/FrexSansGB-OG-*.ttf',
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  // Posts and projects are read from the repository at render time. The
  // slug is dynamic, so output tracing cannot discover these files from the
  // readFile calls on its own when packaging serverless functions.
  outputFileTracingIncludes: {
    '/og': [
      ...ogRuntimeAssets,
      './content/blog/**/*',
      './content/projects/**/*',
      './public/images/headshot.jpg',
    ],
    '/blog/**': ['./content/blog/**/*', ...ogRuntimeAssets],
    '/projects/**': ['./content/projects/**/*', ...ogRuntimeAssets],
    '/content/\\[\\.\\.\\.path\\]': [
      './content/blog/**/*',
      './content/projects/**/*',
    ],
  },

  // Pin the project root: when developing from a git worktree nested inside
  // another checkout, Next's lockfile-based root inference walks too far up.
  turbopack: { root: import.meta.dirname },

  // Shared-element morphs (cover/title) on route navigation; browsers
  // without the View Transitions API just navigate instantly.
  experimental: {
    viewTransition: true,
    globalNotFound: true,
    useTypeScriptCli: true,
    sri: { algorithm: 'sha256' },
  },

  images: {
    // Post images are served from content/ via app/content/[...path]/route.ts;
    // site portraits/avatars live in public/images
    localPatterns: [
      { pathname: '/content/**' },
      { pathname: '/images/**' },
      { pathname: '/_next/static/**' },
    ],
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [...securityHeaders],
    },
    {
      // Proxied link media (favicons, Open Graph images) are never a
      // document that may run in this origin. Same-key entries later in
      // this list override the global policy above, so exactly one
      // Content-Security-Policy header is sent.
      source: '/link-media/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'none'; sandbox",
        },
      ],
    },
  ],

  // The checked-in manifest is the v3 cutover contract for every preserved,
  // replaced or retired public URL from the legacy site.
  redirects: async () => legacyRedirects,

  rewrites: async () => legacyRewrites,
}

export default nextConfig
