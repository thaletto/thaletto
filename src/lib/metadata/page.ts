/**
 * Next.js `Metadata` builder shared by all public routes.
 *
 * Wraps `seo` and `publicPageMetadata` into a complete metadata object —
 * canonical URL, OG/Twitter tags, robots, and per-route alternates — so each
 * route only supplies its path, title, and description.
 */
import type { Metadata } from 'next'

import { siteIdentity } from '~/lib/content/personal'

import { seo } from './seo'

interface MetadataOptions {
  path: string
  title: string
  description: string
  type?: 'article' | 'website'
}

export function pageUrl(path: string) {
  return new URL(path, seo.url)
}

/** Build server-rendered metadata for an English-only route. */
export function pageMetadata({
  path,
  title,
  description,
  type = 'website',
}: MetadataOptions): Metadata {
  const canonical = pageUrl(path)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type,
      locale: 'en_US',
      siteName: siteIdentity.name,
      url: canonical,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}
