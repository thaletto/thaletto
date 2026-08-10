'use client'

import { cn } from '~/lib/platform/utils'
import { LifelineFireworksProvider } from './lifeline-fireworks'
import { LifelineVertical } from './lifeline-vertical'
import type { LifelineProps } from './types'

/**
 * `lifeline-typeset` carries the timeline's own font stack (Geist, falling
 * back to the system sans) rather than inheriting the host's `font-sans`.
 * A shadcn init writes a self-referential `--font-sans` into the theme
 * block, which resolves to the browser serif, and the timeline is dense
 * enough that the wrong face is the first thing you notice. Override
 * `--lifeline-font` to typeset it in something else.
 *
 * The site always shows the vertical layout, the rail is read top-down
 * with the page instead of scrubbed horizontally.
 */
export function Lifeline(props: LifelineProps) {
  return (
    <LifelineFireworksProvider>
      <div className={cn('lifeline-typeset pt-5', props.className)}>
        <LifelineVertical {...props} />
      </div>
    </LifelineFireworksProvider>
  )
}
