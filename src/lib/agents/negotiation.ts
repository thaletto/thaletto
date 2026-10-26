function quality(accept: string, type: string) {
  const [group] = type.split('/')
  let best = 0

  for (const part of accept.split(',')) {
    const [rawMedia, ...params] = part.trim().split(';')
    const media = rawMedia.trim().toLowerCase()
    if (media !== type && media !== `${group}/*` && media !== '*/*') continue

    let weight = 1
    for (const param of params) {
      const [key, value] = param.trim().split('=')
      if (key === 'q') weight = Number.parseFloat(value)
    }
    best = Math.max(best, weight)
  }

  return best
}

export function prefersMarkdown(accept: string | null) {
  if (!accept) return false
  const markdown = quality(accept, 'text/markdown')
  if (markdown === 0) return false
  return markdown > quality(accept, 'text/html')
}
