'use client'

import { localeFromPathname, type Locale } from '~/lib/locale-route'

export type { Locale } from '~/lib/locale-route'
export { localize } from '~/lib/locale-route'

// English is the only site locale; the hook always reports 'en' so client
// components that thread a locale stay stable.
export function useLocale(): Locale {
  return 'en'
}

export function localeFromPathnameSafe(pathname: string): Locale {
  return localeFromPathname(pathname)
}
