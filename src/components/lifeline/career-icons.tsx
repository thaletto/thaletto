'use client'

// Registers the organization marks the work lifeline references. Imported
// before the timeline renders so the client-bundle side effect maps the ids
// in `src/lib/content/lifeline.ts` to their icons.
import { registerCompanyIcons } from './company-icon'
import { TcsLogo } from '~/components/brand/tcs-logo'

registerCompanyIcons({
  // The mark is wider than tall (aspect ~1.6:1, 677x425), not square.
  tcs: { icon: TcsLogo, sizeClassName: 'h-4 w-[25px]' },
})
