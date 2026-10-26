export function tiltFromSlug(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0
  return ((Math.abs(h) % 401) - 200) / 100
}
