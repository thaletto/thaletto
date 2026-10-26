'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card'

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
