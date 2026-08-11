// Metadata for the deliberately unindexed surfaces (error/404 shells): they
// must not be crawled or best-ranked, but still deserve a human copy tone.
export const nonPublicRobots = { index: false, follow: false } as const

export const nonPublicDescriptions = {
  notFound: "The address works. There just isn't a print here yet.",
} as const
