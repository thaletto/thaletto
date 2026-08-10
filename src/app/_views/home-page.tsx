// `/` view — portrait + introduction, live social numbers, latest posts, and
// the nav cards, assembled from the same content loaders the inner pages use;
// `app/page.tsx` supplies the metadata and streaming shell.
import { GeistPixelSquare } from 'geist/font/pixel'
import Link from 'next/link'
import { PostRow } from '~/components/blog/post-row'
import { HomeIntroduction } from '~/components/home/home-introduction'
import { NavCards } from '~/components/home/nav-cards'
import { ExternalLabel } from '~/components/social/external-mark'
import { TechStack, TechStackItem } from '~/components/tech-stack'
import { Bun } from '~/components/ui/svgs/bun'
import { Cloudflare } from '~/components/ui/svgs/cloudflare'
import { Docker } from '~/components/ui/svgs/docker'
import { EffectDark } from '~/components/ui/svgs/effectDark'
import { EffectLight } from '~/components/ui/svgs/effectLight'
import { Fastapi } from '~/components/ui/svgs/fastapi'
import { Git } from '~/components/ui/svgs/git'
import { Golang } from '~/components/ui/svgs/golang'
import { GolangDark } from '~/components/ui/svgs/golangDark'
import { Google } from '~/components/ui/svgs/google'
import { GoogleCloud } from '~/components/ui/svgs/googleCloud'
import { LangchainLogo } from '~/components/ui/svgs/langchainLogo'
import { Microsoft } from '~/components/ui/svgs/microsoft'
import { NextjsIconDark } from '~/components/ui/svgs/nextjsIconDark'
import { Postgresql } from '~/components/ui/svgs/postgresql'
import { Python } from '~/components/ui/svgs/python'
import { QdrantIconDark } from '~/components/ui/svgs/qdrantIconDark'
import { QdrantIconLight } from '~/components/ui/svgs/qdrantIconLight'
import { ReactLight } from '~/components/ui/svgs/reactLight'
import { Redis } from '~/components/ui/svgs/redis'
import { Tanstack } from '~/components/ui/svgs/tanstack'
import { Typescript } from '~/components/ui/svgs/typescript'
import { Vercel } from '~/components/ui/svgs/vercel'
import { VercelDark } from '~/components/ui/svgs/vercelDark'
import { HalftonePortrait } from '~/components/visual/halftone-portrait'
import { PixelCluster } from '~/components/visual/pixel-cluster'
import { PortraitHiddenStage } from '~/components/visual/portrait-hidden-stage'
import { careerLifeline } from '~/lib/content/lifeline'
import { siteExperience, siteIdentity } from '~/lib/content/personal'
import { getAllPosts } from '~/lib/content/posts'
import { getAllProjects } from '~/lib/content/projects'
import { getGitHub, getSocial } from '~/lib/content/social-live'

function SectionTitle({
  index,
  children,
  delay,
}: {
  index: string
  children: React.ReactNode
  delay: number
}) {
  return (
    <h2
      className="section-tag enter"
      style={{ '--enter-delay': `${delay}ms` } as React.CSSProperties}
    >
      <span className="section-tag-index" aria-hidden>
        {index}
      </span>
      <span className="section-tag-hatch" aria-hidden />
      <span className="section-tag-label">{children}</span>
    </h2>
  )
}

export async function HomePageView() {
  const [social, github] = await Promise.all([getSocial(), getGitHub()])
  const posts = getAllPosts()
  const projects = getAllProjects()
  const latest = posts.slice(0, 5)
  const center = (latest.length - 1) / 2

  // section tags number in render order; conditional shelves never leave gaps
  let sectionCount = 0
  const nextSectionIndex = () => String(++sectionCount).padStart(2, '0')

  return (
    <div className="mx-auto w-full max-w-150 px-6">
      <div className="flex flex-col-reverse justify-between gap-10 sm:flex-row sm:items-start">
        <div className="enter max-w-76">
          <div className="flex items-center gap-2">
            <h1
              className={`${GeistPixelSquare.className} text-xl uppercase tracking-tight text-foreground`}
            >
              {siteIdentity.name}
            </h1>
            <PixelCluster variant={2} className="shrink-0" />
          </div>
          <div className="mt-4">
            <HomeIntroduction social={social.x} github={github} />
          </div>
        </div>
        <div className="w-[9.35rem] shrink-0 sm:w-60">
          <PortraitHiddenStage
            label={`${siteIdentity.portraitAlt}. Reveal the hidden topographic field`}
          >
            <HalftonePortrait src="/images/avatar.png" alt={siteIdentity.portraitAlt} />
          </PortraitHiddenStage>
        </div>
      </div>

      <NavCards
        postCount={posts.length}
        projectCount={projects.length}
        milestoneCount={careerLifeline.markers.length}
      />

      <section className="mt-16">
        <SectionTitle index={nextSectionIndex()} delay={120}>
          Experience
        </SectionTitle>
        <ul className="mt-4 flex flex-col">
          {siteExperience.map((job, i) => (
            <li
              key={job.company}
              className="enter-swing hairline-top"
              style={{ '--enter-delay': `${150 + i * 40}ms` } as React.CSSProperties}
            >
              <div className="experience-row text-sm">
                <div className="experience-details">
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="experience-company font-medium transition-colors duration-150 ease-[ease] hover:text-foreground"
                    >
                      <ExternalLabel>{job.company}</ExternalLabel>
                    </a>
                  ) : (
                    <span className="experience-company font-medium">{job.company}</span>
                  )}
                  <span className="experience-role text-muted-foreground">{job.role}</span>
                </div>
                <span className="experience-date text-muted-foreground tabular-nums">
                  {job.yearRange}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <TechStack className="enter mt-16" index={nextSectionIndex()} title="Skills">
        <TechStackItem label="Python">
          <Python />
        </TechStackItem>
        <TechStackItem label="TypeScript">
          <Typescript />
        </TechStackItem>
        <TechStackItem label="Go">
          <Golang className="tech-stack-icon-theme-light" />
          <GolangDark className="tech-stack-icon-theme-dark" />
        </TechStackItem>
        <TechStackItem label="Bun">
          <Bun />
        </TechStackItem>
        <TechStackItem label="React">
          <ReactLight />
        </TechStackItem>
        <TechStackItem label="Next.js">
          <NextjsIconDark className="tech-stack-icon-needs-invert" />
        </TechStackItem>
        <TechStackItem label="TanStack Start">
          <Tanstack className="tech-stack-icon-needs-invert" />
        </TechStackItem>
        <TechStackItem label="Effect">
          <EffectLight className="tech-stack-icon-theme-light" />
          <EffectDark className="tech-stack-icon-theme-dark" />
        </TechStackItem>
        <TechStackItem label="FastAPI">
          <Fastapi />
        </TechStackItem>
        <TechStackItem label="Git">
          <Git />
        </TechStackItem>
        <TechStackItem label="Docker">
          <Docker />
        </TechStackItem>
        <TechStackItem label="PostgreSQL">
          <Postgresql />
        </TechStackItem>
        <TechStackItem label="Autogen">
          <Microsoft />
        </TechStackItem>
        <TechStackItem label="Google ADK">
          <Google />
        </TechStackItem>
        <TechStackItem label="LangChain">
          <LangchainLogo />
        </TechStackItem>
        <TechStackItem label="AI SDK">
          <Vercel className="tech-stack-icon-theme-light" />
          <VercelDark className="tech-stack-icon-theme-dark" />
        </TechStackItem>
        <TechStackItem label="Redis">
          <Redis />
        </TechStackItem>
        <TechStackItem label="Qdrant">
          <QdrantIconLight className="tech-stack-icon-theme-light" />
          <QdrantIconDark className="tech-stack-icon-theme-dark" />
        </TechStackItem>
        <TechStackItem label="Cloudflare D1">
          <Cloudflare />
        </TechStackItem>
        <TechStackItem label="Google Cloud">
          <GoogleCloud />
        </TechStackItem>
      </TechStack>

      <section className="mt-16">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle index={nextSectionIndex()} delay={200}>
            Writing
          </SectionTitle>
          <Link
            href="/blog"
            className="enter relative shrink-0 text-sm text-muted-foreground transition-colors duration-150 ease-[ease] after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] hover:text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-offset-4"
            style={{ '--enter-delay': '200ms' } as React.CSSProperties}
          >
            View all
          </Link>
        </div>
        <ul className="focus-list mt-4 flex flex-col">
          {latest.map((post, index) => (
            <li
              key={post.slug}
              className="enter-swing"
              style={
                {
                  '--enter-delay': `${240 + Math.abs(index - center) * 50}ms`,
                } as React.CSSProperties
              }
            >
              <PostRow post={post} headingLevel="h3" dateStyle="short" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
