import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'
import { z } from 'zod'

const PROJECTS_DIR = path.join(process.cwd(), 'content/projects')

const projectLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
})

const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  publishedAt: z.coerce.date(),
  sort: z.number().optional(),
  company: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  links: z.array(projectLinkSchema).default([]),
  cover: z.string().startsWith('./').optional(),
  coverWidth: z.number().int().positive().optional(),
  coverHeight: z.number().int().positive().optional(),
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

export interface ProjectRow extends Omit<Project, 'body' | 'bodyUnits' | 'readingMinutes' | 'cover'> {
  cover?: ProjectCover
}

const projectsBySlug = new Map<string, Project>()

function bodyStats(body: string) {
  const text = body.replace(/```[\s\S]*?```/g, '')
  const words = (text.match(/[A-Za-z0-9]+/g) ?? []).length
  return {
    units: words,
    minutes: Math.max(1, Math.round(words / 200)),
  }
}

export function getAllProjectSlugs() {
  return readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => existsSync(path.join(PROJECTS_DIR, slug, 'index.mdx')))
}

export function getProject(slug: string): Project {
  const cached = projectsBySlug.get(slug)
  if (cached) return cached

  const raw = readFileSync(path.join(PROJECTS_DIR, slug, 'index.mdx'), 'utf8')
  const { data, content } = matter(raw)
  const fm = projectFrontmatterSchema.parse(data)

  const stats = bodyStats(content)

  let cover: ProjectCover | undefined
  if (fm.cover) {
    if (!fm.coverWidth || !fm.coverHeight)
      throw new Error(`${slug}: cover requires coverWidth and coverHeight`)
    cover = {
      src: `/content/projects/${slug}/${fm.cover.slice(2)}`,
      width: fm.coverWidth,
      height: fm.coverHeight,
    }
  }

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
    body: content,
    bodyUnits: stats.units,
    readingMinutes: stats.minutes,
  }
  projectsBySlug.set(slug, project)
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
