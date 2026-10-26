import type { NextConfig } from 'next'

import legacyUrlManifest from './src/content/legacy-url-manifest.json'
import { agentLinkHeader, contentSignal } from './src/lib/agents/discovery'
import { resolveProfileDestination } from './src/lib/content/personal'
import { securityHeaders } from './src/lib/security/headers'

const legacyRedirects = legacyUrlManifest.entries.flatMap((entry) =>
  entry.kind === 'redirect' && typeof entry.destination === 'string'
    ? [
        {
          source: entry.source,
          destination: resolveProfileDestination(entry.destination),
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

  // Content is read at render time from dynamic slugs, so tracing cannot discover it.
  outputFileTracingIncludes: {
    '/blog/**': ['./src/content/blog/**/*'],
    '/projects/**': ['./src/content/projects/**/*'],
    '/content/\\[\\.\\.\\.path\\]': ['./src/content/blog/**/*', './src/content/projects/**/*'],
    '/api/agent-markdown': ['./src/content/**/*.mdx', './src/content/*.json'],
    '/llms.txt': ['./src/content/**/*.mdx', './src/content/*.json'],
    '/llms-full.txt': ['./src/content/**/*.mdx', './src/content/*.json'],
  },

  // Next's lockfile inference walks above a worktree nested in another checkout.
  turbopack: { root: import.meta.dirname },

  experimental: {
    globalNotFound: true,
    useTypeScriptCli: true,
    sri: { algorithm: 'sha256' },
  },

  images: {
    localPatterns: [
      { pathname: '/content/**' },
      { pathname: '/images/**' },
      { pathname: '/_next/static/**' },
    ],
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [...securityHeaders, { key: 'Content-Signal', value: contentSignal }],
    },
    {
      source: '/:path((?!_next/|content/|api/|\\.well-known/).*)',
      headers: [{ key: 'Link', value: agentLinkHeader }],
    },
  ],

  redirects: async () => legacyRedirects,

  rewrites: async () => legacyRewrites,
}

export default nextConfig
