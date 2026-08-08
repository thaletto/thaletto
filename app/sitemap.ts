import type { MetadataRoute } from 'next'

import { getAllPosts } from '~/lib/content'
import { pageUrl } from '~/lib/metadata'
import { getAllProjects } from '~/lib/projects-content'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const projects = getAllProjects()
  // newest first per getAllPosts — the site "changed" when the latest post landed
  const latest = posts[0]?.publishedAt

  const entry = (path: string, lastModified?: Date): MetadataRoute.Sitemap => [
    { url: pageUrl(path).href, lastModified },
  ]

  return [
    ...entry('/', latest),
    ...entry('/blog', latest),
    ...entry('/projects', latest),
    ...posts.flatMap((post) => entry(`/blog/${post.slug}`, post.publishedAt)),
    ...projects.map((project) => ({
      url: pageUrl(`/projects/${project.slug}`).href,
      lastModified: project.publishedAt,
    })),
  ]
}