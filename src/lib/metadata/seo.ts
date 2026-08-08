import { publicPageMetadata } from './public-page-metadata'

/**
 * Static SEO constants.
 *
 * The single source of the canonical origin: `PUBLIC_SITE_URL` is validated
 * (must be HTTPS outside local dev) so canonical links, OG metadata, and the
 * sitemap never emit a malformed URL. `seo` is consumed everywhere metadata
 * is assembled.
 */
function publicSiteUrl() {
  const raw =
    process.env.PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === 'production'
      ? 'https://thaletto.vercel.app'
      : 'http://localhost:3000')
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error('PUBLIC_SITE_URL must be a valid URL')
  }
  if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) {
    throw new Error('PUBLIC_SITE_URL must use HTTPS outside local development')
  }
  return url
}

export const seo = {
  title: publicPageMetadata.home.title,
  description: publicPageMetadata.home.description,
  url: publicSiteUrl(),
} as const
