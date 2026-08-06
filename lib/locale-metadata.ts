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
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}
