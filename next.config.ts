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

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  agentRules: false,

  // Posts and projects are read from the repository at render time. The
  // slug is dynamic, so output tracing cannot discover these files from the
  // readFile calls on its own when packaging serverless functions.
  outputFileTracingIncludes: {
    '/blog/**': ['./content/blog/**/*'],
    '/projects/**': ['./content/projects/**/*'],
    '/content/\\[\\.\\.\\.path\\]': [
      './content/blog/**/*',
      './content/projects/**/*',
    ],
  },

  // Pin the project root: when developing from a git worktree nested inside
  // another checkout, Next's lockfile-based root inference walks too far up.
  turbopack: { root: import.meta.dirname },

  // View Transitions are enabled by default in the App Router
  experimental: {
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
  ],

  // The checked-in manifest is the v3 cutover contract for every preserved,
  // replaced or retired public URL from the legacy site.
  redirects: async () => legacyRedirects,

  rewrites: async () => legacyRewrites,
}

export default nextConfig
