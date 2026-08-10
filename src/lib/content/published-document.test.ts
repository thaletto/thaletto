import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { after, describe, test } from 'node:test'
import { z } from 'zod'
import { getPost } from './posts'
import { getAllProjects, getProject } from './projects'
import {
  discoverPublishedSlugs,
  publishedFrontmatterSchema,
  readPublishedDocument,
} from './published-document'

const root = mkdtempSync(path.join(tmpdir(), 'published-document-'))
after(() => rmSync(root, { recursive: true, force: true }))

const writingSchema = publishedFrontmatterSchema.extend({
  title: z.string().min(1),
  publishedAt: z.coerce.date(),
})

function writeEntry(slug: string, source: string) {
  const directory = path.join(root, slug)
  mkdirSync(directory, { recursive: true })
  writeFileSync(path.join(directory, 'index.mdx'), source)
}

describe('Published Document', () => {
  test('publishes existing Writing through its stable interface', () => {
    const post = getPost('the-great-pyramid-of-js')

    assert.equal(post.slug, 'the-great-pyramid-of-js')
    assert.ok(post.bodyUnits > 0)
    assert.ok(post.readingMinutes > 0)
  })

  test('publishes existing Projects through their stable interface and ordering', () => {
    const project = getProject('ams')
    const projects = getAllProjects()

    assert.equal(project.slug, 'ams')
    assert.ok(project.bodyUnits > 0)
    assert.ok(Array.isArray(project.tags))
    assert.ok(Array.isArray(project.links))
    assert.ok(
      projects.every(
        (entry, index) =>
          index === 0 || Number(projects[index - 1].sort ?? 0) >= Number(entry.sort ?? 0),
      ),
    )
  })

  test('discovers only directories with an index document', () => {
    writeEntry('published', '---\ntitle: Published\npublishedAt: 2026-08-10\n---\nHello world')
    mkdirSync(path.join(root, 'draft'))

    assert.deepEqual(discoverPublishedSlugs(root), ['published'])
  })

  test('reads validated frontmatter, cover metadata, and body statistics', () => {
    writeEntry(
      'covered',
      '---\ntitle: Covered\npublishedAt: 2026-08-10\ncover: ./cover.webp\ncoverWidth: 1200\ncoverHeight: 800\ncoverCaption: A cover\n---\nOne two three four',
    )

    const document = readPublishedDocument({
      collection: 'Writing',
      directory: root,
      slug: 'covered',
      schema: writingSchema,
      coverRoot: '/content/blog',
    })

    assert.equal(document.frontmatter.title, 'Covered')
    assert.deepEqual(document.cover, {
      src: '/content/blog/covered/cover.webp',
      width: 1200,
      height: 800,
      caption: 'A cover',
    })
    assert.deepEqual(document.stats, { units: 4, minutes: 1 })
  })

  test('reports the collection and slug for invalid content', () => {
    writeEntry(
      'broken-cover',
      '---\ntitle: Broken\npublishedAt: 2026-08-10\ncover: ./cover.webp\n---\nBody',
    )

    assert.throws(
      () =>
        readPublishedDocument({
          collection: 'Writing',
          directory: root,
          slug: 'broken-cover',
          schema: writingSchema,
          coverRoot: '/content/blog',
        }),
      /Writing broken-cover.*coverWidth.*coverHeight/,
    )
  })

  test('reads the latest authored content instead of retaining stale process data', () => {
    writeEntry('fresh', '---\ntitle: First\npublishedAt: 2026-08-10\n---\nBody')
    const options = {
      collection: 'Writing',
      directory: root,
      slug: 'fresh',
      schema: writingSchema,
      coverRoot: '/content/blog',
    } as const

    assert.equal(readPublishedDocument(options).frontmatter.title, 'First')
    writeEntry('fresh', '---\ntitle: Second\npublishedAt: 2026-08-10\n---\nBody')
    assert.equal(readPublishedDocument(options).frontmatter.title, 'Second')
  })
})
