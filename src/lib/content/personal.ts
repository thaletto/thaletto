import { z } from 'zod'

import authoredSite from '../../content/site.json'

const identitySchema = z.object({
  name: z.string().min(1),
  firstName: z.string().min(1),
  role: z.string().min(1),
  email: z.email(),
  country: z.string().min(1),
  homeCity: z.string().min(1),
  portraitAlt: z.string().min(1),
  location: z.object({
    latitude: z.string().min(1),
    longitude: z.string().min(1),
  }),
})

const yearMonthSchema = z.string().regex(/^\d{4}\.(0[1-9]|1[0-2])$/, 'must use YYYY.MM')

const authoredExperienceSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: yearMonthSchema,
  endDate: yearMonthSchema.optional(),
  url: z.url().optional(),
  timelinePhoto: z
    .object({
      src: z.string().startsWith('/'),
      alt: z.string().min(1),
    })
    .optional(),
})

const siteProfileSchema = z.object({
  identity: identitySchema,
  social: z.object({
    x: z.object({ name: z.string().min(1), handle: z.string().min(1), bio: z.string().optional() }),
    linkedin: z.object({ handle: z.string().min(1), bio: z.string().optional() }),
    notion: z.object({ name: z.string().min(1), url: z.url(), bio: z.string().optional() }),
    github: z.object({ user: z.string().min(1) }),
  }),
  resumes: z.object({ primary: z.url(), alternate: z.url() }),
  experience: z.array(authoredExperienceSchema),
})

export interface SiteMonth {
  year: number
  month: number
}

export interface SiteExperience {
  id: string
  company: string
  role: string
  start: SiteMonth
  end?: SiteMonth
  yearRange: string
  url?: string
  timelinePhoto?: { src: string; alt: string }
}

function parseSiteMonth(value: string): SiteMonth {
  const [year, month] = value.split('.').map(Number)
  return { year, month }
}

export function parseSiteProfile(input: unknown) {
  const result = siteProfileSchema.safeParse(input)
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'profile'}: ${issue.message}`)
      .join('; ')
    throw new Error(`Invalid Site Profile — ${details}`)
  }

  const { identity, social, resumes } = result.data
  const experience: SiteExperience[] = result.data.experience.map((job) => {
    const start = parseSiteMonth(job.startDate)
    const end = job.endDate ? parseSiteMonth(job.endDate) : undefined
    return {
      id: job.id,
      company: job.company,
      role: job.role,
      start,
      end,
      yearRange: `${start.year}—${end?.year ?? 'now'}`,
      url: job.url,
      timelinePhoto: job.timelinePhoto,
    }
  })
  return {
    identity,
    social,
    resumes,
    experience,
    destinations: {
      x: `https://x.com/${social.x.handle}`,
      linkedin: `https://www.linkedin.com/in/${social.linkedin.handle}/`,
      github: `https://github.com/${social.github.user}`,
      resume: resumes.primary,
      alternateResume: resumes.alternate,
    },
  }
}

const profile = parseSiteProfile(authoredSite)

export const siteIdentity = profile.identity
export const siteSocial = profile.social
export const siteResumes = profile.resumes
export const siteDestinations = profile.destinations
export const siteExperience = profile.experience

export function resolveProfileDestination(destination: string) {
  if (!destination.startsWith('profile:')) return destination
  const key = destination.slice('profile:'.length) as keyof typeof siteDestinations
  const resolved = siteDestinations[key]
  if (!resolved) throw new Error(`Unknown profile destination: ${destination}`)
  return resolved
}
