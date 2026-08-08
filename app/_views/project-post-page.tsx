import { MDXRemote } from 'next-mdx-remote/rsc'
import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { ExternalLabel } from '~/components/external-mark'
import { mdxComponents } from '~/components/mdx/mdx-components'
import { PixelCluster } from '~/components/pixel-cluster'
import { PolaroidCover } from '~/components/polaroid-cover'
import { RevealScope } from '~/components/reveal-scope'
import { pageMetadata } from '~/lib/metadata'
import remarkMermaid from '~/lib/remark-mermaid'
import { projectViewTransitionName } from '~/lib/view-transition-name'
import {
  getAllProjects,
  getProject,
  isProjectSlug,
} from '~/lib/projects-content'

export function generateProjectStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }))
}

export function requireProjectSlug(slug: string) {
  if (!isProjectSlug(slug)) notFound()
  return slug
}

export function projectMetadata(slug: string) {
  const project = getProject(requireProjectSlug(slug))

  return pageMetadata({
    path: `/projects/${project.slug}`,
    title: project.title,
    description: project.description,
    type: 'website',
  })
}

async function CachedProjectBody({ slug }: { slug: string }) {
  'use cache'
  cacheLife('max')

  const project = getProject(slug)
  const prettyCodePlugin: [
    typeof rehypePrettyCode,
    { theme: { light: string; dark: string } },
  ] = [
    rehypePrettyCode,
    { theme: { light: 'github-light-default', dark: 'github-dark-default' } },
  ]

  return (
    <MDXRemote
      source={project.body}
      components={mdxComponents(slug, 'projects')}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMermaid],
          rehypePlugins: [rehypeSlug, prettyCodePlugin],
        },
      }}
    />
  )
}

export async function ProjectPostPageView({ slug }: { slug: string }) {
  const project = getProject(requireProjectSlug(slug))
  const clusterVariant = [...project.slug].reduce(
    (sum, ch) => sum + ch.charCodeAt(0),
    0,
  )

  return (
    <article className="post-article mx-auto w-full max-w-[37.5rem] px-6">
      <header>
        {project.cover && (
          <PolaroidCover
            slug={project.slug}
            cover={project.cover}
            alt={project.title}
            priority
            morph
            print="collage"
            sizes="(max-width: 704px) 100vw, 656px"
            transitionName={projectViewTransitionName('cover', project.slug)}
          />
        )}
        <div className="post-title-card">
          <div className="mt-10 flex items-start justify-between gap-4">
            <h1
              className="text-2xl font-semibold tracking-tight text-balance"
              style={{ viewTransitionName: projectViewTransitionName('title', project.slug) } as React.CSSProperties}
            >
              {project.title}
            </h1>
            <PixelCluster variant={clusterVariant} className="mt-1.5 shrink-0" />
          </div>
          <dl className="post-title-meta spec-plate">
            {project.startDate && (
              <div>
                <dt>Period</dt>
                <dd>
                  <span className="spec-signal" aria-hidden />
                  {project.startDate}
                  {project.endDate ? ` — ${project.endDate}` : ' — now'}
                </dd>
              </div>
            )}
            {project.company && (
              <div>
                <dt>Company</dt>
                <dd>{project.company}</dd>
              </div>
            )}
            {project.tags.length > 0 && (
              <div>
                <dt>Stack</dt>
                <dd>{project.tags.join(' · ')}</dd>
              </div>
            )}
            {project.links.length > 0 && (
              <div>
                <dt>Links</dt>
                <dd className="flex flex-wrap gap-x-3 gap-y-1">
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground"
                    >
                      <ExternalLabel>{link.label}</ExternalLabel>
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </header>
      <RevealScope lang="en" className="post-body-stage prose enter mt-10">
        <Suspense fallback={null}>
          <CachedProjectBody slug={project.slug} />
        </Suspense>
      </RevealScope>
    </article>
  )
}
