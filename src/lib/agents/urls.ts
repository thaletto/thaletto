import { seo } from '~/lib/metadata/seo'

export function absoluteUrl(pathname = '/') {
  return new URL(pathname, seo.url).href
}
