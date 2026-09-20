// `/` view — portrait + introduction, live social numbers, latest posts, and
// the nav cards, assembled from the same content loaders the inner pages use;
// `app/page.tsx` supplies the metadata and streaming shell.
import Link from 'next/link'
import { PostRow } from '~/components/blog/post-row'
import { HomeIntroduction } from '~/components/home/home-introduction'
import { ProjectRow } from '~/components/projects/project-row'
import { ExternalLabel } from '~/components/social/external-mark'
import { PixelCluster } from '~/components/visual/pixel-cluster'
import { siteExperience, siteIdentity } from '~/lib/content/personal'
import { getAllPosts } from '~/lib/content/posts'
import { getProjectRows } from '~/lib/content/projects'
import { getGitHub, getSocial } from '~/lib/content/social-live'

function SectionTitle({
  children,
  delay,
}: {
  children: React.ReactNode
  delay: number
}) {
  return (
    <h2
      className="section-tag section-tag-ruled enter"
      style={{ '--enter-delay': `${delay}ms` } as React.CSSProperties}
    >
      <span className="align-center">{children}</span>
      <span className="section-tag-rule" aria-hidden />
    </h2>
  )
}

export async function HomePageView() {
  const [social, github] = await Promise.all([getSocial(), getGitHub()])
  const posts = getAllPosts()
  const latest = posts.slice(0, 5)
  const center = (latest.length - 1) / 2
  const projects = getProjectRows()
  const projectCenter = (projects.length - 1) / 2

  // section tags number in render order; conditional shelves never leave gaps
  let sectionCount = 0
  const nextSectionIndex = () => String(++sectionCount).padStart(2, '0')

  return (
    <div className="mx-auto w-full max-w-168 px-6">
      <div className="flex flex-col-reverse justify-between gap-10 sm:flex-row sm:items-start">
        <div className="enter">
          <div className="flex items-center gap-2">
            <h1
              className="font-sans text-xl font-medium tracking-tight text-foreground"
            >
              {siteIdentity.name}
            </h1>
            <PixelCluster variant={2} className="shrink-0" />
          </div>
          <div className="mt-4">
            <HomeIntroduction social={social.x} github={github} />
          </div>
        </div>
      </div>

      <section className="mt-16">
        <SectionTitle delay={120}>
          Experience
        </SectionTitle>
        <ul className="mt-4 flex flex-col">
          {siteExperience.map((job, i) => (
            <li
              key={job.company}
              className="enter-swing"
              style={{ '--enter-delay': `${150 + i * 40}ms` } as React.CSSProperties}
            >
              <div className="experience-row text-sm">
                <div className="experience-details">
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="experience-company transition-colors duration-150 ease-[ease]"
                    >
                      <ExternalLabel>{job.company}</ExternalLabel>
                    </a>
                  ) : (
                    <span className="experience-company font-medium">{job.company}</span>
                  )}
                  <span className="experience-role text-muted-foreground">{job.role}</span>
                </div>
                <span className="experience-date shrink-0 text-muted-foreground tabular-nums">
                  {job.yearRange}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <SectionTitle delay={200}>
          Projects
        </SectionTitle>
        <ul className="mt-4 flex flex-col">
          {projects.map((project, index) => (
            <li
              key={project.slug}
              className="enter-swing"
              style={
                {
                  '--enter-delay': `${240 + Math.abs(index - projectCenter) * 50}ms`,
                } as React.CSSProperties
              }
            >
              <ProjectRow project={project} headingLevel="h3" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <SectionTitle delay={280}>
          Writing
        </SectionTitle>
        <ul className="mt-4 flex flex-col">
          {latest.map((post, index) => (
            <li
              key={post.slug}
              className="enter-swing"
              style={
                {
                  '--enter-delay': `${320 + Math.abs(index - center) * 50}ms`,
                } as React.CSSProperties
              }
            >
              <PostRow post={post} headingLevel="h3" dateStyle="full" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
