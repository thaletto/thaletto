// Typed access to the canonical personal registry in `src/content/site.json`.
import site from '~/content/site.json'

export const siteProfile = site

export interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  url?: string
  timelinePhoto?: {
    src: string
    alt: string
  }
}

export const experience: Experience[] = site.experience

export function experienceYearRange(job: Experience) {
  const from = job.startDate.slice(0, 4)
  const to = job.endDate?.slice(0, 4) ?? 'now'
  return `${from}—${to}`
}
