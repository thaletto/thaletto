'use client'

import { PreviewCard } from '@base-ui/react/preview-card'
import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

const PREVIEW_OPEN_DELAY_MS = 300
const PREVIEW_WARM_WINDOW_MS = 300

type PreviewCardSide = 'top' | 'bottom' | 'left' | 'right'

type PreviewCardPayload = {
  id: string
  popup: React.ReactNode
  popupClassName: string
  side?: PreviewCardSide
}

type SharedPreviewCard = {
  delay: number
  handle: PreviewCard.Handle<PreviewCardPayload>
}

type SitePreviewCardProps = {
  children: React.ReactNode
  href: string
  target?: string
  rel?: string
  triggerClassName: string
  popup: React.ReactNode
  popupClassName: string
  side?: PreviewCardSide
  closeDelay: number
}

const PreviewCardTimingContext = createContext<SharedPreviewCard | null>(null)

function PreviewSurface({ payload }: { payload: PreviewCardPayload }) {
  return (
    <PreviewCard.Portal>
      <PreviewCard.Positioner
        side={payload.side}
        sideOffset={8}
        collisionPadding={16}
        className="pointer-events-none z-[var(--z-card)]"
      >
        <PreviewCard.Popup
          className={(state) =>
            `${payload.popupClassName}${state.instant ? ' preview-card-instant' : ''}`
          }
        >
          <Fragment key={payload.id}>{payload.popup}</Fragment>
        </PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  )
}

function PreviewTrigger({
  children,
  closeDelay,
  delay,
  handle,
  href,
  payload,
  rel,
  target,
  triggerClassName,
}: SitePreviewCardProps & {
  delay: number
  handle: PreviewCard.Handle<PreviewCardPayload>
  payload: PreviewCardPayload
}) {
  return (
    <PreviewCard.Trigger
      handle={handle}
      payload={payload}
      href={href}
      target={target}
      rel={rel}
      className={triggerClassName}
      delay={delay}
      closeDelay={closeDelay}
    >
      {children}
    </PreviewCard.Trigger>
  )
}

export function PreviewCardTimingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [handle] = useState(() => PreviewCard.createHandle<PreviewCardPayload>())
  const [delay, setDelay] = useState(PREVIEW_OPEN_DELAY_MS)
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCooldown = useCallback(() => {
    if (cooldownRef.current === null) return
    clearTimeout(cooldownRef.current)
    cooldownRef.current = null
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      clearCooldown()
      setDelay(0)
      if (open) return

      cooldownRef.current = setTimeout(() => {
        cooldownRef.current = null
        setDelay(PREVIEW_OPEN_DELAY_MS)
      }, PREVIEW_WARM_WINDOW_MS)
    },
    [clearCooldown],
  )

  useEffect(() => clearCooldown, [clearCooldown])

  const shared = useMemo(() => ({ delay, handle }), [delay, handle])

  return (
    <PreviewCardTimingContext.Provider value={shared}>
      {children}
      <PreviewCard.Root handle={handle} onOpenChange={handleOpenChange}>
        {({ payload }) =>
          payload ? <PreviewSurface payload={payload} /> : null
        }
      </PreviewCard.Root>
    </PreviewCardTimingContext.Provider>
  )
}

function StandalonePreviewCard({
  payload,
  ...props
}: SitePreviewCardProps & { payload: PreviewCardPayload }) {
  const [handle] = useState(() => PreviewCard.createHandle<PreviewCardPayload>())

  return (
    <>
      <PreviewTrigger
        {...props}
        payload={payload}
        handle={handle}
        delay={PREVIEW_OPEN_DELAY_MS}
      />
      <PreviewCard.Root handle={handle}>
        {({ payload: activePayload }) =>
          activePayload ? <PreviewSurface payload={activePayload} /> : null
        }
      </PreviewCard.Root>
    </>
  )
}

export function SitePreviewCard(props: SitePreviewCardProps) {
  const shared = useContext(PreviewCardTimingContext)
  const id = useId()
  const payload = useMemo<PreviewCardPayload>(
    () => ({
      id,
      popup: props.popup,
      popupClassName: props.popupClassName,
      side: props.side,
    }),
    [id, props.popup, props.popupClassName, props.side],
  )

  if (!shared) return <StandalonePreviewCard {...props} payload={payload} />

  return (
    <PreviewTrigger
      {...props}
      payload={payload}
      handle={shared.handle}
      delay={shared.delay}
    />
  )
}
