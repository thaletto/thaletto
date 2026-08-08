export type PostTransitionElement = 'cover' | 'title'

/*
 * FNV-1a 32-bit: fast, deterministic, hex-only output. Slugs are arbitrary
 * content, so a view-transition-name is never built from them directly —
 * derive a stable hash and prefix it with a letter to keep the value a valid
 * CSS identifier. No registration: any slug just works, and the same slug
 * always maps to the same name so the listing/detail morph keeps matching.
 */
function hash32(value: string) {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16)
}

/*
 * Post and project namespaces keep distinct prefixes so a slug that somehow
 * existed in both lists never shares a view-transition-name.
 */
export function postViewTransitionName(
  element: PostTransitionElement,
  slug: string,
) {
  return `${element}-p${hash32(slug)}`
}

export function projectViewTransitionName(
  element: PostTransitionElement,
  slug: string,
) {
  return `${element}-pr${hash32(slug)}`
}
