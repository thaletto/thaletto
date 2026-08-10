// The life-and-work timeline for `/timeline`, resolved to the month.
//
// Personal milestones (school, university, TCS) are authored here; project
// markers are derived from the project registry (`src/content/projects/*`)
// so their months always agree with the project pages. The axis unit is
// months since birth (`Aug 2003` is index 0), and every marker carries a
// `label` ("Mar 2018") and an `age` so the rail reads month-precise.

import type { LifelineMarker, LifelinePhoto } from '~/components/lifeline/types'
import { siteExperience, siteIdentity } from '~/lib/content/personal'
import { getAllProjects, type Project } from '~/lib/content/projects'
import type { LifelineRecord } from '~/lib/lifeline-data'

// Birth month anchors the axis: August 2003.
const BIRTH_YEAR = 2003
const BIRTH_MONTH = 8 // 1-based → "Aug"

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

interface MonthPoint {
  year: number
  month: number
}

/** Months since the axis anchor, the timeline's unit. */
function monthIndex(point: MonthPoint) {
  return (point.year - BIRTH_YEAR) * 12 + (point.month - BIRTH_MONTH)
}

function dateAt(index: number) {
  return new Date(Date.UTC(BIRTH_YEAR, BIRTH_MONTH - 1 + index, 1))
}

function monthLabel(index: number) {
  const date = dateAt(index)
  return `${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

/** Cohort age in the marker's year, the number the Age column shows. */
function ageAt(index: number) {
  return String(dateAt(index).getUTCFullYear() - BIRTH_YEAR)
}

/** Images live in `public/timeline/`. */
const schoolPhoto: LifelinePhoto = {
  src: '/timeline/mirs.jpg',
  alt: 'Maharishi International Residential School',
}
const universityPhoto: LifelinePhoto = {
  src: '/timeline/amrita.png',
  alt: 'Amrita Vishwa Vidyapeetham, Coimbatore',
}
function at(
  point: MonthPoint,
  fields: Omit<LifelineMarker, 'id' | 'year' | 'age'>,
): LifelineMarker {
  const index = monthIndex(point)
  return {
    id: `${point.year}-${point.month}`,
    year: index,
    label: monthLabel(index),
    age: ageAt(index),
    ...fields,
  }
}

/** Rail event line composed from the registry's own title + description. */
function projectEventText(project: Project): string {
  const description = project.description.charAt(0).toLowerCase() + project.description.slice(1)
  return `${project.title}: ${description}`
}

/** One marker per project, placed at its end month. */
function projectMarkers(): LifelineMarker[] {
  const markers: LifelineMarker[] = []

  for (const project of getAllProjects()) {
    const when = project.endDate ?? project.startDate
    if (!when) continue

    const [year, month] = when.split('.').map(Number)
    const index = monthIndex({ year, month })

    markers.push({
      id: project.slug,
      year: index,
      label: monthLabel(index),
      age: ageAt(index),
      events: [projectEventText(project)],
    })
  }

  return markers.sort((a, b) => a.year - b.year)
}

function experienceMarkers(): LifelineMarker[] {
  return siteExperience.map((job) => {
    const roleArticle = /^[aeiou]/i.test(job.role) ? 'an' : 'a'
    return at(job.start, {
      events: [
        { text: `Joined ${job.company} as ${roleArticle} ${job.role}`, effect: 'fireworks' },
      ],
      companies: [{ id: job.id, name: job.company }],
      photos: job.timelinePhoto ? [job.timelinePhoto] : undefined,
    })
  })
}

const personalMarkers: LifelineMarker[] = [
  at(
    { year: 2003, month: 8 },
    {
      events: [`I was born in ${siteIdentity.homeCity}, Tamil Nadu, India`],
      companies: [{ id: 'baby', name: 'Birth' }],
    },
  ),
  at(
    { year: 2018, month: 3 },
    {
      events: ['Completed CBSE Class X at Maharishi International Residential School'],
      companies: [{ id: 'school', name: 'School' }],
      photos: [schoolPhoto],
    },
  ),
  at(
    { year: 2020, month: 3 },
    {
      events: ['Completed CBSE Class XII at Maharishi International Residential School'],
      companies: [{ id: 'school', name: 'School' }],
    },
  ),
  at(
    { year: 2020, month: 9 },
    {
      events: ['Started B.Tech at Amrita Vishwa Vidyapeetham, Coimbatore'],
      companies: [{ id: 'university', name: 'University' }],
      photos: [universityPhoto],
    },
  ),
  at(
    { year: 2024, month: 5 },
    {
      events: ['Graduated with a B.Tech'],
      companies: [{ id: 'university', name: 'University' }],
    },
  ),
]

const nowMarkers: LifelineMarker[] = [
  at(
    { year: 2026, month: 8 },
    {
      label: 'Now',
      events: ['Building, learning, shipping. The next milestone is yours.'],
    },
  ),
]

/**
 * The site's own life-and-work timeline: personal milestones authored
 * here, project markers derived from `src/content/projects/*`, resolved
 * to the month and sorted along the rail.
 */
export const careerLifeline: LifelineRecord = {
  slug: 'career',
  name: `${siteIdentity.firstName}: from ${siteIdentity.homeCity} to building`,
  birthYear: BIRTH_YEAR,
  description: 'Life, school, and work, resolved to the month.',
  markers: [...personalMarkers, ...experienceMarkers(), ...projectMarkers(), ...nowMarkers].sort(
    (a, b) => a.year - b.year,
  ),
}
