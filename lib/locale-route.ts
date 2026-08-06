export type Locale = 'zh' | 'en'

function splitPathSuffix(path: string) {
  const suffixIndex = path.search(/[?#]/)
  if (suffixIndex === -1) return { pathname: path, suffix: '' }
  return {
    pathname: path.slice(0, suffixIndex),
    suffix: path.slice(suffixIndex),
  }
}

function assertSafePathname(pathname: string) {
  if (
    !pathname.startsWith('/') ||
    pathname.startsWith('//') ||
    pathname.includes('\\') ||
    pathname.includes('\0') ||
    /[\u0000-\u001f\u007f]/.test(pathname)
  ) {
    throw new Error('Invalid locale path')
  }

  const segments = pathname.split('/')
  const finalSegment = segments.length - 1

  for (const [index, segment] of segments.entries()) {
    if (segment === '' && index !== 0 && index !== finalSegment) {
      throw new Error('Invalid locale path')
    }

    let decoded: string
    try {
      decoded = decodeURIComponent(segment)
    } catch {
      throw new Error('Invalid locale path')
    }

    if (
      decoded === '.' ||
      decoded === '..' ||
      decoded.includes('/') ||
      decoded.includes('\\') ||
      /[\u0000-\u001f\u007f]/.test(decoded)
    ) {
      throw new Error('Invalid locale path')
    }
  }
}

function normalizePathname(pathname: string) {
  if (!pathname || pathname === '/') return '/'
  assertSafePathname(pathname)
  return pathname
}

// English is the only site locale; paths are unlocalized. The Locale union
// survives for type-compatibility with components that still thread a
// locale prop, but every function is English-only.
export function localeFromPathname(pathname: string): Locale {
  normalizePathname(splitPathSuffix(pathname).pathname)
  return 'en'
}

export function unlocalizedPathname(pathname: string) {
  return normalizePathname(splitPathSuffix(pathname).pathname)
}

export function localePath(_locale: Locale, path: string) {
  const { pathname, suffix } = splitPathSuffix(path)
  const unlocalized = unlocalizedPathname(pathname)
  return `${unlocalized}${suffix}`
}

export function localize(_locale: Locale, _zh: string, en: string) {
  return en
}
