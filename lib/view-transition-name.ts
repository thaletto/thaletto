export type PostTransitionElement = 'cover' | 'title'

function projectTransitionId(slug: string) {
  const known = [
    'ams',
    'ascendant',
    'cortex',
    'e-commerce-store',
    'google-gtm-portal',
    'kite',
    'lense',
    'lung-nodule-detection',
    'parkinsons-disease-detection',
  ]
  const index = known.indexOf(slug)
  if (index === -1) throw new Error('Unknown project view-transition slug')
  return `pr${String(index + 1).padStart(2, '0')}`
}

function postTransitionId(slug: string) {
  switch (slug) {
    case 'how-i-stole-the-design-of-my-portfolio':
      return 'p11'
    case 'the-great-pyramid-of-js':
      return 'p12'
    default:
      throw new Error('Unknown post view-transition slug')
  }
}

// View-transition names are CSS identifiers. Keep every stored content key
// behind an explicit allowlist before it reaches an inline style value.
export function postViewTransitionName(
  element: PostTransitionElement,
  slug: string,
) {
  return `${element}-${postTransitionId(slug)}`
}

export function projectViewTransitionName(
  element: PostTransitionElement,
  slug: string,
) {
  return `${element}-${projectTransitionId(slug)}`
}
