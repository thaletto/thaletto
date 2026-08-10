import type { NextConfig } from 'next'

import legacyUrlManifest from './src/content/legacy-url-manifest.json'
import site from './src/content/site.json'
import { securityHeaders } from './src/lib/security/headers'

const profileDestinations: Record<string, string> = {
  x: `https://x.com/${site.social.x.handle}`,
  linkedin: `https://www.linkedin.com/in/${site.social.linkedin.handle}/`,
  github: `https://github.com/${site.social.github.user}`,
  resume: site.resumes.primary,
  alternateResume: site.resumes.alternate,
}

function resolveLegacyDestination(destination: string) {
  if (!destination.startsWith('profile:')) return destination
  const resolved = profileDestinations[destination.slice('profile:'.length)]
  if (!resolved) throw new Error(`Unknown profile destination: ${destination}`)
  return resolved
}

const legacyRedirects = legacyUrlManifest.entries.flatMap((entry) =>
  entry.kind === 'redirect' && typeof entry.destination === 'string'
    ? [
        {
          source: entry.source,
          destination: resolveLegacyDestination(entry.destination),
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
    '/blog/**': ['./src/content/blog/**/*'],
    '/projects/**': ['./src/content/projects/**/*'],
    '/content/\\[\\.\\.\\.path\\]': ['./src/content/blog/**/*', './src/content/projects/**/*'],
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
