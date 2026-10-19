'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card'

// A gloss in the margins: a word in prose that opens a small card on hover
// or on focus with its meaning. The trigger renders as a real button, so
// Enter opens and Escape closes. The dotted-underline register and the
// card's motion live in site CSS keyed on the components' data-slots.
export function Term({ children: word, definition }: { children: string; definition: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger closeDelay={120} delay={200} render={<button type="button" />}>
        {word}
      </HoverCardTrigger>
      <HoverCardContent className="w-auto max-w-72" side="top" sideOffset={6}>
        <p className="text-[13px] leading-relaxed text-muted-foreground">{definition}</p>
      </HoverCardContent>
    </HoverCard>
  )
}
