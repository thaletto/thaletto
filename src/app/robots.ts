// robots.txt for the public surface. Only the legacy `/confirm/` path is
// disallowed; everything public is crawlable by design.
import type { MetadataRoute } from 'next'

import { seo } from '~/lib/metadata/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/confirm/'],
    },
    sitemap: new URL('/sitemap.xml', seo.url).href,
    host: seo.url.origin,
  }
}
