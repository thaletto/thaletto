import nextConfig from '@/next.config'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `https://thaletto.vercel.app/sitemap.xml`,
  }
}
