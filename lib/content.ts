import { readFileSync } from 'node:fs'
import path from 'node:path'

import GithubSlugger from 'github-slugger'
import matter from 'gray-matter'
import { z } from 'zod'

import {
  isPublishedPostSlug,
  publishedPostSlugs,
} from './public-content-routes'

const POSTS_DIR = path.join(process.cwd(), 'content/blog')

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  publishedAt: z.coerce.date(),
  cover: z.string().startsWith('./').optional(),
  coverWidth: z.number().int().positive().optional(),
  coverHeight: z.number().int().positive().optional(),
  coverCaption: z.string().optional(),
})

export interface PostCover {
  src: string
  width: number
  height: number
  caption?: string
}

export interface Post {
  slug: string
  title: string
  description?: string
  publishedAt: Date
  cover?: PostCover
  readingMinutes: number
  bodyUnits: number
  body: string
}

export const POST_ARTICLE_START_ID = 'post-article-start'

export type PostRailNode =
  | { key: string; kind: 'tick' }
  | {
      key: string
      kind: 'landmark'
      id: string
      label: string
      variant: 'title' | 'heading'
    }

const fencePattern = /^\s{0,3}(`{3,}|~{3,})/
const headingPattern = /^\s{0,3}(#{2,3})\s+(.+?)\s*$/
const TICKS_BETWEEN_LANDMARKS = 3

function cleanHeading(raw: string) {
  return raw
    .replace(/\s+#+\s*$/, '')
    .replace(/!?(?:\[([^\]]+)\])\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .trim()
}

// Build a deliberately even document minimap. Heading IDs use the same
// github-slugger algorithm as rehype-slug, while a fixed number of quiet ticks
// separates every landmark so prose length never changes the rail's rhythm.
export function buildPostRail(title: string, body: string, idPrefix = ''): PostRailNode[] {
  const slugger = new GithubSlugger()
  const lines = body.split(/\r?\n/)
  const nodes: PostRailNode[] = [
    {
      key: 'title',
      kind: 'landmark',
      id: POST_ARTICLE_START_ID,
      label: title,
      variant: 'title',
    },
  ]
  let index = 0
  let landmark = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
      continue
    }

    const fence = line.match(fencePattern)?.[1]
    if (fence) {
      const closingFence = new RegExp(`^\\s{0,3}${fence[0]}{${fence.length},}\\s*$`)
      index += 1
      while (index < lines.length && !closingFence.test(lines[index])) index += 1
      if (index < lines.length) index += 1
      continue
    }

    const heading = line.match(headingPattern)
    if (heading) {
      const label = cleanHeading(heading[2])
      for (let tick = 0; tick < TICKS_BETWEEN_LANDMARKS; tick += 1) {
        nodes.push({ key: `gap-${landmark}-${tick}`, kind: 'tick' })
      }
      nodes.push({
        key: `landmark-${landmark}`,
        kind: 'landmark',
        id: `${idPrefix}${slugger.slug(label)}`,
        label,
        variant: 'heading',
      })
      landmark += 1
      index += 1
      continue
    }

    index += 1
  }

  return nodes
}

// Words are the countable prose atoms the spec plate reports
function bodyStats(body: string) {
  const text = body.replace(/```[\s\S]*?```/g, '')
  const words = (text.match(/[A-Za-z0-9]+/g) ?? []).length
  return {
    units: words,
    minutes: Math.max(1, Math.round(words / 200)),
  }
}

export function getPost(slug: string): Post {
  const raw = readFileSync(path.join(POSTS_DIR, slug, 'index.mdx'), 'utf8')
  const { data, content } = matter(raw)
  const fm = frontmatterSchema.parse(data)

  const stats = bodyStats(content)

  let cover: PostCover | undefined
  if (fm.cover) {
    if (!fm.coverWidth || !fm.coverHeight)
      throw new Error(`${slug}: cover requires coverWidth and coverHeight`)
    cover = {
      src: `/content/blog/${slug}/${fm.cover.slice(2)}`,
      width: fm.coverWidth,
      height: fm.coverHeight,
      caption: fm.coverCaption,
    }
  }

  return {
    slug,
    title: fm.title,
    description: fm.description,
    publishedAt: fm.publishedAt,
    cover,
    readingMinutes: stats.minutes,
    bodyUnits: stats.units,
    body: content,
  }
}

export function isPostSlug(slug: string) {
  return isPublishedPostSlug(slug)
}

// ── "Posts like this" ─────────────────────────────────────────────────
// Lexical similarity computed at build time — no tags to maintain. Terms
// are lowercased words (stop words dropped); title terms weigh triple.
// Cosine over term frequencies, with recency breaking ties.

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'you', 'are', 'but', 'not', 'with', 'this', 'that',
  'was', 'were', 'have', 'has', 'had', 'can', 'will', 'your', 'from',
  'they', 'them', 'its', 'our', 'about', 'into', 'just', 'more', 'some',
  'than', 'then', 'when', 'what', 'how', 'why', 'who', 'all', 'one',
  'out', 'also', 'very',
])

function addTerms(vector: Map<string, number>, text: string, weight: number) {
  const bump = (term: string) =>
    vector.set(term, (vector.get(term) ?? 0) + weight)
  const clean = text.replace(/```[\s\S]*?```/g, ' ').toLowerCase()

  for (const word of clean.match(/[a-z0-9]{3,}/g) ?? []) {
    if (!STOP_WORDS.has(word)) bump(word)
  }
}

function similarity(a: Map<string, number>, b: Map<string, number>) {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a]
  let dot = 0
  for (const [term, count] of small) {
    const other = large.get(term)
    if (other) dot += count * other
  }
  const norm = (vector: Map<string, number>) =>
    Math.sqrt([...vector.values()].reduce((sum, count) => sum + count * count, 0))
  return dot / (norm(a) * norm(b) || 1)
}

// keyed on body lengths too, so a dev-mode content edit refreshes the vector
const postVectors = new Map<string, Map<string, number>>()

function postVector(post: Post) {
  const key = `${post.slug}:${post.title.length}:${post.body.length}`
  const cached = postVectors.get(key)
  if (cached) return cached
  const vector = new Map<string, number>()
  addTerms(vector, post.title, 3)
  addTerms(vector, post.body, 1)
  postVectors.set(key, vector)
  return vector
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const posts = getAllPosts()
  const current = posts.find((post) => post.slug === slug)
  if (!current) return []
  const target = postVector(current)

  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({ post, score: similarity(target, postVector(post)) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.publishedAt.getTime() - a.post.publishedAt.getTime(),
    )
    .slice(0, limit)
    .map((entry) => entry.post)
}

export function getAllPosts(): Post[] {
  return publishedPostSlugs
    .map((slug) => getPost(slug))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}
