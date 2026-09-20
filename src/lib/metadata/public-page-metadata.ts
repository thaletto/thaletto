import { siteIdentity } from '~/lib/content/personal'

export const publicPageMetadata = {
  home: {
    title: siteIdentity.name,
    description: siteIdentity.role,
    ogDescription: siteIdentity.role,
  },
} as const
