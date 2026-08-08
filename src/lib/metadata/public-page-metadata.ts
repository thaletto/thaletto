export const publicPageMetadata = {
  home: {
    title: 'Laxman K R',
    description: 'AI Engineer',
    ogDescription: 'AI Engineer',
  },
  blog: {
    title: 'Writing',
    description: 'Notes on engineering, products, tools etc...',
  },
  projects: {
    title: 'Projects',
    description: 'Projects, Libraries, Freelance work, etc...',
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
