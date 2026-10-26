import type { MetadataRoute } from 'next'

import { getAllPosts } from '~/lib/content/posts'
import { getAllProjects } from '~/lib/content/projects'
import { pageUrl } from '~/lib/metadata/page'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const projects = getAllProjects()
  const latest = posts[0]?.publishedAt

  const entry = (path: string, lastModified?: Date): MetadataRoute.Sitemap => [
    { url: pageUrl(path).href, lastModified },
  ]

  return [
    ...entry('/', latest),
    ...posts.flatMap((post) => entry(`/blog/${post.slug}`, post.publishedAt)),
    ...projects.map((project) => ({
      url: pageUrl(`/projects/${project.slug}`).href,
      lastModified: project.publishedAt,
    })),
  ]
}
