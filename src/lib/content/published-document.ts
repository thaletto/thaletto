import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'
import { z } from 'zod'

export const publishedFrontmatterSchema = z.object({
  cover: z.string().startsWith('./').optional(),
  coverWidth: z.number().int().positive().optional(),
  coverHeight: z.number().int().positive().optional(),
  coverCaption: z.string().optional(),
})

export interface PublishedCover {
  src: string
  width: number
  height: number
  caption?: string
}

export interface PublishedDocument<T> {
  frontmatter: T
  body: string
  stats: { units: number; minutes: number }
  cover?: PublishedCover
}

export function discoverPublishedSlugs(directory: string) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => existsSync(path.join(directory, slug, 'index.mdx')))
}

function bodyStats(body: string) {
  const text = body.replace(/```[\s\S]*?```/g, '')
  const words = (text.match(/[A-Za-z0-9]+/g) ?? []).length
  return { units: words, minutes: Math.max(1, Math.round(words / 200)) }
}

export function readPublishedDocument<T extends z.ZodType>({
  collection,
  directory,
  slug,
  schema,
  coverRoot,
}: {
  collection: string
  directory: string
  slug: string
  schema: T
  coverRoot: string
}): PublishedDocument<z.output<T>> {
  try {
    const raw = readFileSync(path.join(directory, slug, 'index.mdx'), 'utf8')
    const { data, content } = matter(raw)
    const frontmatter = schema.parse(data) as z.output<T> &
      z.infer<typeof publishedFrontmatterSchema>

    const hasCover = frontmatter.cover !== undefined
    const hasCoverWidth = frontmatter.coverWidth !== undefined
    const hasCoverHeight = frontmatter.coverHeight !== undefined
    const hasCoverCaption = frontmatter.coverCaption !== undefined
    if (
      (hasCover || hasCoverWidth || hasCoverHeight || hasCoverCaption) &&
      !(hasCover && hasCoverWidth && hasCoverHeight)
    ) {
      throw new Error('cover, coverWidth, and coverHeight must be provided together')
    }

    let cover: PublishedCover | undefined
    if (frontmatter.cover) {
      cover = {
        src: `${coverRoot}/${slug}/${frontmatter.cover.slice(2)}`,
        width: frontmatter.coverWidth as number,
        height: frontmatter.coverHeight as number,
        ...(frontmatter.coverCaption ? { caption: frontmatter.coverCaption } : {}),
      }
    }

    return { frontmatter, body: content, stats: bodyStats(content), cover }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`${collection} ${slug}: ${message}`, { cause: error })
  }
}
