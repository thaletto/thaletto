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

export function ProjectPostRoute({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<ProjectPostLoadingShell />}>
      <ProjectPostRouteContent params={params} />
    </Suspense>
  )
}

async function ProjectPostRouteContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProjectPostPageView slug={slug} />
}

function ProjectPostLoadingShell() {
  const label = 'Loading project'

  return (
    <article
      aria-busy="true"
      data-post-loading-shell
      className="post-article mx-auto min-h-[calc(100svh-3.5rem)] w-full max-w-[37.5rem] px-6"
    >
      <div role="status" aria-label={label}>
        <span className="sr-only">{label}</span>
        <div aria-hidden className="polaroid post-loading-cover">
          <div className="polaroid-photo aspect-video bg-muted/40" />
          <div className="polaroid-caption">
            <span className="h-2 w-24 bg-muted/50" />
          </div>
        </div>
        <div aria-hidden className="mt-10 h-24 space-y-3">
          <div className="post-loading-title h-7 w-4/5 bg-muted/60" />
          <div className="h-13 w-full bg-muted/45" />
        </div>
        <div aria-hidden className="mt-10 space-y-3">
          <div className="h-3 w-full bg-muted/35" />
          <div className="h-3 w-11/12 bg-muted/35" />
          <div className="h-3 w-3/4 bg-muted/35" />
        </div>
      </div>
    </article>
  )
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
          <dl className="post-title-meta spec-plate spec-plate-flow">
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
