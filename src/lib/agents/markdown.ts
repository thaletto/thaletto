import { siteDestinations, siteExperience, siteIdentity, siteSocial } from '~/lib/content/personal'
import { getAllPosts, getPost, isPostSlug } from '~/lib/content/posts'
import { getProject, getProjectRows, isProjectSlug } from '~/lib/content/projects'

import { agentLinkHeader, contentSignal } from './discovery'
import { absoluteUrl } from './urls'

interface MarkdownDocument {
  markdown: string
  status: number
}

function yamlFrontmatter(fields: Array<[string, string | undefined]>) {
  const lines = fields.flatMap(([key, value]) =>
    value === undefined || value === '' ? [] : [`${key}: ${JSON.stringify(value)}`],
  )
  if (lines.length === 0) return ''
  return `---\n${lines.join('\n')}\n---\n\n`
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function markdownImage(alt: string, href: string, title?: string) {
  return `![${alt}](${href}${title ? ` "${title}"` : ''})`
}

function absolutizeLinks(markdown: string) {
  return markdown.replace(/(\]\()(\/[^)\s]+)(\))/g, (_, open, href, close) => {
    return `${open}${absoluteUrl(href)}${close}`
  })
}

function stripMdx(markdown: string) {
  let fence: string | null = null

  const lines = markdown.split('\n').map((line) => {
    const opening = line.match(/^\s{0,3}(`{3,}|~{3,})/)
    if (opening) {
      if (fence === null) fence = opening[1][0].repeat(opening[1].length)
      else if (line.trim().startsWith(fence)) fence = null
      return line
    }

    if (fence !== null) return line

    return line
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
      .replace(/<\/?[A-Z][A-Za-z0-9]*(?:\s[^<>]*)?\/?>/g, '')
  })

  return lines
    .filter((line) => !/^\s*(?:import|export)\s/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function postDocument(slug: string) {
  const post = getPost(slug)
  const cover = post.cover ? `${markdownImage(post.title, absoluteUrl(post.cover.src))}\n\n` : ''
  const description = post.description ? `${post.description}\n\n` : ''
  const body = absolutizeLinks(
    stripMdx(post.body)
      .replace(
        /!\[([^\]]*)\]\(\.\/([A-Za-z0-9_.-]+)(?:#\d+x\d+)?(?:\s+"([^"]*)")?\)/g,
        (_, alt: string, file: string, title?: string) =>
          markdownImage(alt, absoluteUrl(`/content/blog/${slug}/${file}`), title),
      )
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  )

  return { post, markdown: `# ${post.title}\n\n${description}${cover}${body}\n` }
}

function projectDocument(slug: string) {
  const project = getProject(slug)
  const cover = project.cover
    ? `${markdownImage(project.title, absoluteUrl(project.cover.src))}\n\n`
    : ''
  const links =
    project.links.length > 0
      ? `${project.links.map((link) => `- [${link.label}](${link.url})`).join('\n')}\n\n`
      : ''
  const tags = project.tags.length > 0 ? `Tags: ${project.tags.join(', ')}\n\n` : ''
  const body = absolutizeLinks(
    stripMdx(project.body)
      .replace(
        /!\[([^\]]*)\]\(\.\/([A-Za-z0-9_.-]+)(?:#\d+x\d+)?(?:\s+"([^"]*)")?\)/g,
        (_, alt: string, file: string, title?: string) =>
          markdownImage(alt, absoluteUrl(`/content/projects/${slug}/${file}`), title),
      )
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  )

  return {
    project,
    markdown: `# ${project.title}\n\n${project.description}\n\n${tags}${links}${cover}${body}\n`,
  }
}

function homeDocument() {
  const posts = getAllPosts()
  const projects = getProjectRows()
  const experience = siteExperience
    .map((job) => `- **${job.company}** — ${job.role} (${job.yearRange})`)
    .join('\n')
  const writing = posts
    .map(
      (post) =>
        `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}) — ${post.description ?? 'Essay'} (${formatDate(post.publishedAt)})`,
    )
    .join('\n')
  const projectList = projects
    .map(
      (project) =>
        `- [${project.title}](${absoluteUrl(`/projects/${project.slug}`)}) — ${project.description}`,
    )
    .join('\n')

  return `# ${siteIdentity.name}

> ${siteIdentity.role} in ${siteIdentity.country}. I build intelligent, well-structured products, from the interface people use to the systems that power it.

## About

${siteSocial.x.bio ?? siteIdentity.role}

I write about engineering, products, tools, and AI systems. This site is the canonical home for that work.

## Experience

${experience}

## Projects

${projectList}

## Writing

${writing}

## Elsewhere

- [GitHub](${siteDestinations.github})
- [LinkedIn](${siteDestinations.linkedin})
- [X](${siteDestinations.x})
- [Resume](${siteDestinations.resume})

## Agent resources

- [llms.txt](${absoluteUrl('/llms.txt')}) — this index
- [llms-full.txt](${absoluteUrl('/llms-full.txt')}) — complete text of every page
- [API catalog](${absoluteUrl('/.well-known/api-catalog')}) — machine-readable linkset
- [Sitemap](${absoluteUrl('/sitemap.xml')})
`
}

export function llmsIndex() {
  return homeDocument()
}

export function llmsFull() {
  const posts = getAllPosts().map((post) => postDocument(post.slug).markdown)
  const projects = getProjectRows().map((project) => projectDocument(project.slug).markdown)

  return `${homeDocument()}

---

${projects.join('\n---\n\n')}

---

${posts.join('\n---\n\n')}
`
}

export function markdownForPath(pathname: string): MarkdownDocument {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === '/') {
    return {
      status: 200,
      markdown: `${yamlFrontmatter([
        ['title', siteIdentity.name],
        ['description', siteIdentity.role],
        ['url', absoluteUrl('/')],
      ])}${homeDocument()}`,
    }
  }

  const postMatch = /^\/blog\/([a-z0-9-]+)$/.exec(path)
  if (postMatch && isPostSlug(postMatch[1])) {
    const { post, markdown } = postDocument(postMatch[1])
    return {
      status: 200,
      markdown: `${yamlFrontmatter([
        ['title', post.title],
        ['description', post.description],
        ['url', absoluteUrl(`/blog/${post.slug}`)],
        ['publishedAt', post.publishedAt.toISOString()],
      ])}${markdown}`,
    }
  }

  const projectMatch = /^\/projects\/([a-z0-9-]+)$/.exec(path)
  if (projectMatch && isProjectSlug(projectMatch[1])) {
    const { project, markdown } = projectDocument(projectMatch[1])
    return {
      status: 200,
      markdown: `${yamlFrontmatter([
        ['title', project.title],
        ['description', project.description],
        ['url', absoluteUrl(`/projects/${project.slug}`)],
        ['publishedAt', project.publishedAt.toISOString()],
      ])}${markdown}`,
    }
  }

  return {
    status: 404,
    markdown: `# Not found

No markdown representation exists for \`${path}\`.

See [llms.txt](${absoluteUrl('/llms.txt')}) for everything on this site.
`,
  }
}

function estimateTokens(markdown: string) {
  return Math.ceil(markdown.length / 4)
}

export function markdownResponse(markdown: string, status = 200) {
  return new Response(markdown, {
    status,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Signal': contentSignal,
      Link: agentLinkHeader,
      Vary: 'Accept',
      'x-markdown-tokens': String(estimateTokens(markdown)),
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}

export function textResponse(body: string, contentType = 'text/plain; charset=utf-8') {
  return new Response(body, {
    headers: {
      'Content-Type': contentType,
      'Content-Signal': contentSignal,
      Link: agentLinkHeader,
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
