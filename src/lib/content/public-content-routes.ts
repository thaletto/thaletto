// Publishing a post requires adding its directory slug here. The public-route
// proxy, post index, feeds, and sitemap all consume this explicit allowlist.
export const publishedPostSlugs = [
  'how-i-stole-the-design-of-my-portfolio',
  'the-great-pyramid-of-js',
] as const

export function isPublishedPostSlug(slug: string) {
  return publishedPostSlugs.some((publishedSlug) => publishedSlug === slug)
}
