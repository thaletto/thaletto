import nextConfig from '@/next.config'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${(nextConfig as { env: { WEBSITE_URL: string } }).env.WEBSITE_URL}/sitemap.xml`,
  }
}
