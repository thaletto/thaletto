export type PostTransitionElement = 'cover' | 'title'

// view-transition-name must be a valid CSS ident, so hash the slug and prefix it.
function hash32(value: string) {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16)
}

export function postViewTransitionName(element: PostTransitionElement, slug: string) {
  return `${element}-p${hash32(slug)}`
}

export function projectViewTransitionName(element: PostTransitionElement, slug: string) {
  return `${element}-pr${hash32(slug)}`
}
