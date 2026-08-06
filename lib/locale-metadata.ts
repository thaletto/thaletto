import type { Metadata } from 'next'

import type { Locale } from './locale-route'
import { localePath } from './locale-route'
import { seo } from './seo'

interface LocaleMetadataOptions {
  locale: Locale
  path: string
  title: string
  description: string
  type?: 'article' | 'website'
}

const SOCIAL_IMAGE_VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12)
const SECTION_IMAGE_PATHS = new Set(['/blog', '/projects'])

export function socialImageUrl(locale: Locale, path: string) {
  const url = new URL('/og', seo.url)
  url.searchParams.set('locale', locale)
  url.searchParams.set('path', path)
  if (SOCIAL_IMAGE_VERSION) url.searchParams.set('v', SOCIAL_IMAGE_VERSION)
  return url
}

export function localeRoutePair(path: string) {
  const href = new URL(localePath('en', path), seo.url)

  return {
    en: href,
    languages: { en: href.href, 'x-default': href.href },
    alternates: { languages: { en: href.href, 'x-default': href.href } },
  }
}

/** Build server-rendered metadata for an English-only route. */
export function localeMetadata({
  locale,
  path,
  title,
  description,
  type = 'website',
}: LocaleMetadataOptions): Metadata {
  const canonical = new URL(localePath(locale, path), seo.url)
  const image = {
    url: socialImageUrl('en', path),
    width: 1200,
    height: 630,
    alt:
      path === '/'
        ? `${title}. ${description}`
        : SECTION_IMAGE_PATHS.has(path)
          ? `${title} · Cali Castle. ${description}`
          : `${title} · Cali Castle`,
    type: 'image/png',
  }

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { en: canonical.href, 'x-default': canonical.href },
    },
    openGraph: {
      title,
      description,
      type,
      locale: 'en_US',
      siteName: 'Cali Castle',
      url: canonical,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
