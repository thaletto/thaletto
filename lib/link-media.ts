import previews from '~/content/link-previews.json'
import { ogZolplayUrl } from '~/lib/og-zolplay.mjs'

// Targets the /link-media proxy will serve, derived from the build-time
// preview snapshot (content/link-previews.json) plus the few chrome links
// that live outside prose — the proxy can never be aimed at an arbitrary
// host. Links added to a post before the snapshot refreshes fall back to
// the service directly (see lib/link-previews.ts).
const EXTRA_FAVICON_ORIGINS = ['https://zolplay.com']

const snapshot = previews as Record<string, { hasImage?: boolean }>

const faviconOrigins = new Set<string>(EXTRA_FAVICON_ORIGINS)
const imageTargets = new Set<string>()

for (const [href, preview] of Object.entries(snapshot)) {
  try {
    faviconOrigins.add(new URL(href).origin)
  } catch {
    continue
  }
  if (preview.hasImage) imageTargets.add(href)
}

export type LinkMediaKind = 'favicon' | 'image'

// Resolves a proxy target to its og.zolplay.com upstream, or null when the
// target isn't allowlisted. Favicons resolve per site: any target under a
// known origin maps to that origin's icon; images require the exact page
// URL recorded in the snapshot.
export function upstreamLinkMediaUrl(kind: string, target: string): string | null {
  if (kind === 'favicon') {
    let origin: string
    try {
      origin = new URL(target).origin
    } catch {
      return null
    }
    return faviconOrigins.has(origin) ? ogZolplayUrl('favicon', origin) : null
  }

  if (kind === 'image') {
    return imageTargets.has(target) ? ogZolplayUrl('image', target) : null
  }

  return null
}

export function linkMediaPath(kind: LinkMediaKind, target: string): string {
  return `/link-media/${kind}?url=${encodeURIComponent(target)}`
}
