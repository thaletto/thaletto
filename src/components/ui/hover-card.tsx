'use client'

import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card'
import { cn } from 'cn'

function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({ className, ...props }: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      className={cn(
        'outline-none focus-visible:outline-1 focus-visible:outline-(--focus-ring) focus-visible:outline-offset-3',
        className,
      )}
      {...props}
    />
  )
}

function HoverCardContent({
  className,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<PreviewCardPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            'z-50 w-72 origin-(--transform-origin) rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-hidden dark:ring-foreground/10',
            className,
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
