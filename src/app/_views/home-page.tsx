// `/` view — portrait + introduction, live social numbers, latest posts, and
// the nav cards, assembled from the same content loaders the inner pages use;
// `app/page.tsx` supplies the metadata and streaming shell.
import { PostRow } from '~/components/blog/post-row'
import { HomeIntroduction } from '~/components/home/home-introduction'
import { ProjectRow } from '~/components/projects/project-row'
import { ExternalLabel } from '~/components/social/external-mark'
import { PixelCluster } from '~/components/visual/pixel-cluster'
import { siteExperience, siteIdentity } from '~/lib/content/personal'
import { getAllPosts } from '~/lib/content/posts'
import { getProjectRows } from '~/lib/content/projects'
import { getGitHub, getSocial } from '~/lib/content/social-live'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="section-tag section-tag-ruled">
      <span className="align-center">{children}</span>
      <span className="section-tag-rule" aria-hidden />
    </h2>
  )
}

export async function HomePageView() {
  const [social, github] = await Promise.all([getSocial(), getGitHub()])
  const posts = getAllPosts()
  const latest = posts.slice(0, 5)
  const projects = getProjectRows()

  return (
    <div className="mx-auto w-full max-w-173 px-4">
      <div className="flex flex-col-reverse justify-between gap-10 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans text-xl font-medium tracking-tight text-foreground">
              {siteIdentity.name}
            </h1>
            <PixelCluster variant={2} className="shrink-0" />
          </div>
          <div className="mt-4">
            <HomeIntroduction social={social.x} github={github} />
          </div>
        </div>
      </div>

      <section className="mt-16 sm:mt-24">
        <SectionTitle>Experience</SectionTitle>
        <ul className="mt-2 flex flex-col">
          {siteExperience.map((job) => (
            <li key={job.company}>
              <div className="experience-row text-sm">
                <div className="experience-details">
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="experience-company hover:text-foreground"
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

      <section className="mt-16 sm:mt-24">
        <SectionTitle>Projects</SectionTitle>
        <ul className="mt-2 flex flex-col">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectRow project={project} headingLevel="h3" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 sm:mt-24">
        <SectionTitle>Writing</SectionTitle>
        <ul className="mt-2 flex flex-col">
          {latest.map((post) => (
            <li key={post.slug}>
              <PostRow post={post} headingLevel="h3" dateStyle="full" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
