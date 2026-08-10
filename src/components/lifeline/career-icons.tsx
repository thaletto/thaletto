'use client'

import { Baby, School, University } from 'lucide-react'
import { TcsLogo } from '~/components/brand/tcs-logo'
/*
 * Registers the work and life marks the timeline references. Imported before
 * the timeline renders so the client-bundle side effect maps the ids in
 * `src/lib/content/lifeline.ts` to their icons.
 */
import { registerCompanyIcons } from './company-icon'

registerCompanyIcons({
  /* The mark is wider than tall (aspect ~1.6:1, 677x425), not square. */
  tcs: { icon: TcsLogo, sizeClassName: 'h-4 w-[25px]' },
  baby: { icon: Baby, sizeClassName: 'h-5 w-5' },
  school: { icon: School, sizeClassName: 'h-5 w-5' },
  university: { icon: University, sizeClassName: 'h-5 w-5' },
})
