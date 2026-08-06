import type { MetadataRoute } from 'next'

import { getAllPosts } from '~/lib/content'
import { localeRoutePair } from '~/lib/locale-metadata'
import { getAllProjects } from '~/lib/projects-content'
import { seo } from '~/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const projects = getAllProjects()
  // newest first per getAllPosts — the site "changed" when the latest post landed
  const latest = posts[0]?.publishedAt

  const entry = (path: string, lastModified?: Date): MetadataRoute.Sitemap => {
    const pair = localeRoutePair(path)

    return [
      { url: pair.en.href, lastModified, alternates: pair.alternates },
    ]
  }

  return [
    ...entry('/', latest),
    ...entry('/blog', latest),
    ...entry('/projects', latest),
    ...posts.flatMap((post) => entry(`/blog/${post.slug}`, post.publishedAt)),
    ...projects.map((project) => ({
      url: new URL(`/projects/${project.slug}`, seo.url).href,
      lastModified: project.publishedAt,
    })),
  ]
}
