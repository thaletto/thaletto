import path from 'node:path'

import { z } from 'zod'
import {
  discoverPublishedSlugs,
  publishedFrontmatterSchema,
  readPublishedDocument,
} from './published-document'

/**
 * Project content loader.
 *
 * Projects are committed as MDX directories under `src/content/projects/`.
 * This module owns directory listing, frontmatter validation, and the
 * colocated cover-art metadata used by listing and detail pages.
 */
const PROJECTS_DIR = path.join(process.cwd(), 'src/content/projects')

const projectLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
})

const projectFrontmatterSchema = publishedFrontmatterSchema.extend({
  title: z.string().min(1),
  description: z.string().min(1),
  publishedAt: z.coerce.date(),
  sort: z.number().optional(),
  company: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  links: z.array(projectLinkSchema).default([]),
})

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectCover {
  src: string
  width: number
  height: number
}

export interface Project {
  slug: string
  title: string
  description: string
  publishedAt: Date
  sort?: number
  company?: string
  startDate?: string
  endDate?: string
  tags: string[]
  links: ProjectLink[]
  cover?: ProjectCover
  body: string
  bodyUnits: number
  readingMinutes: number
}

export interface ProjectRow
  extends Omit<Project, 'body' | 'bodyUnits' | 'readingMinutes' | 'cover'> {
  cover?: ProjectCover
}

export function getAllProjectSlugs() {
  return discoverPublishedSlugs(PROJECTS_DIR)
}

export function getProject(slug: string): Project {
  const {
    frontmatter: fm,
    body,
    stats,
    cover: publishedCover,
  } = readPublishedDocument({
    collection: 'Projects',
    directory: PROJECTS_DIR,
    slug,
    schema: projectFrontmatterSchema,
    coverRoot: '/content/projects',
  })
  const cover: ProjectCover | undefined = publishedCover
    ? { src: publishedCover.src, width: publishedCover.width, height: publishedCover.height }
    : undefined

  const project: Project = {
    slug,
    title: fm.title,
    description: fm.description,
    publishedAt: fm.publishedAt,
    sort: fm.sort,
    company: fm.company,
    startDate: fm.startDate,
    endDate: fm.endDate,
    tags: fm.tags,
    links: fm.links,
    cover,
    body,
    bodyUnits: stats.units,
    readingMinutes: stats.minutes,
  }
  return project
}

export function getAllProjects(): Project[] {
  return getAllProjectSlugs()
    .map((slug) => getProject(slug))
    .sort((a, b) => Number(b.sort ?? 0) - Number(a.sort ?? 0))
}

export function isProjectSlug(slug: string) {
  return getAllProjectSlugs().includes(slug)
}

// Compact shape for list rows — no bodies, stats, or reading times.
export function getProjectRows(): ProjectRow[] {
  return getAllProjects().map(({ body, bodyUnits, readingMinutes, ...row }) => ({
    ...row,
    cover: row.cover,
  }))
}
