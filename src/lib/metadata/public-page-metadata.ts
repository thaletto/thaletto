import { siteProfile } from '~/lib/content/personal'

export const publicPageMetadata = {
  home: {
    title: siteProfile.identity.name,
    description: siteProfile.identity.role,
    ogDescription: siteProfile.identity.role,
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
    description: 'Life Events, Projects and Work Experience',
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
