export const publicPageMetadata = {
  home: {
    en: {
      title: 'Cali Castle',
      description: 'Design Engineer. Agent Orchestrator. Creative Director.',
      ogDescription: 'Design Engineer. Agent Orchestrator. Creative Director.',
    },
  },
  blog: {
    en: {
      title: 'Writing',
      description:
        'Essays by Cali about design, engineering, products, and the people and ideas that matter along the way.',
    },
  },
  projects: {
    en: {
      title: 'Projects',
      description:
        'Products, open-source tools, and small experiments I have made over the years. Some useful, some playful, all made with care.',
    },
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
