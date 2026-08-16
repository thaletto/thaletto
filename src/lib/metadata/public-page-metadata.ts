import { siteIdentity } from '~/lib/content/personal'

export const publicPageMetadata = {
  home: {
    title: siteIdentity.name,
    description: siteIdentity.role,
    ogDescription: siteIdentity.role,
  },
  blog: {
    title: 'Writing',
    description: 'Notes on engineering, products, tools etc...',
  },
  projects: {
    title: 'Projects',
    description: 'Projects, Libraries, Freelance work, etc...',
  },
  timeline: {
    title: 'Time Variance Authority',
    description: 'Life Events and Work Experience',
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
