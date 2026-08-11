'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  PreferencesIcon,
  ProjectsIcon,
  TimelineIcon,
  WritingIcon,
} from '~/components/dock/dock-icons'
import { Preferences } from '~/components/dock/preferences'
import { useDockActiveIndicator } from '~/hooks/use-dock-active-indicator'
import { dockGoKeyFor, useDockGoShortcuts } from '~/hooks/use-dock-go-shortcuts'
import { playDockSound } from '~/lib/platform/sound'

const ITEMS = [
  { href: '/blog', label: 'Writing', icon: WritingIcon },
  { href: '/projects', label: 'Projects', icon: ProjectsIcon },
  { href: '/timeline', label: 'Timeline', icon: TimelineIcon },
] as const

const DOCK_VIEW_TRANSITION_STYLE = {
  viewTransitionName: 'site-dock',
} as React.CSSProperties

// The frosted pane behind the dock: plain translucency over the pill's 68%
// background, no refraction. The backdrop-filter must stay inline — never in
// the stylesheet — because LightningCSS strips raw backdrop-filter
// declarations.
const DOCK_GLASS_STYLE = {
  backdropFilter: 'blur(12px) saturate(1.25)',
  WebkitBackdropFilter: 'blur(12px) saturate(1.25)',
} as React.CSSProperties

export function DockGlass() {
  return <span className="dock-glass" aria-hidden style={DOCK_GLASS_STYLE} />
}

export function DockTip({ label, goKey }: { label: string; goKey?: string }) {
  return (
    <span className="dock-tip" aria-hidden>
      <span className="dock-tip-label">{label}</span>
      {goKey ? (
        <span className="dock-tip-keys">
          <kbd className="dock-tip-key">{goKey}</kbd>
        </span>
      ) : null}
    </span>
  )
}

export function DockItem({
  href,
  label,
  goKey,
  active = false,
  itemRef,
  onNavigate,
  children,
}: {
  href: string
  label: string
  goKey?: string
  active?: boolean
  itemRef?: (element: HTMLAnchorElement | null) => void
  onNavigate?: (href: string, keyboardInitiated: boolean) => void
  children: React.ReactNode
}) {
  const ariaLabel = goKey ? `${label}, then ${goKey}` : label

  return (
    <Link
      ref={itemRef}
      href={href}
      className="dock-item"
      data-active={active || undefined}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      onClick={
        onNavigate
          ? (event) => {
              if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                onNavigate(href, event.detail === 0)
                if (!active) playDockSound()
              }
            }
          : undefined
      }
    >
      {children}
      <DockTip label={label} goKey={goKey} />
    </Link>
  )
}

export function DockFallback() {
  return (
    <nav
      className="dock"
      style={DOCK_VIEW_TRANSITION_STYLE}
      aria-label="Main navigation"
      aria-busy="true"
    >
      <DockGlass />
      <DockItem href="/" label="Home" goKey={dockGoKeyFor('/')}>
        <span className="dock-avatar">
          <Image src="/images/avatar.png" alt="" width={26} height={26} />
        </span>
      </DockItem>
      <span className="dock-rule" aria-hidden />
      {ITEMS.map(({ href, label, icon: Icon }) => (
        <DockItem key={href} href={href} label={label} goKey={dockGoKeyFor(href)}>
          <Icon />
        </DockItem>
      ))}
      <span className="dock-rule" aria-hidden />
      <button type="button" className="dock-item" aria-label="Loading preferences" disabled>
        <PreferencesIcon />
        <DockTip label="Preferences" />
      </button>
    </nav>
  )
}

// The global pill dock, bottom center — the avatar is home, everything
// else an icon. Circles inside a pill keep the radii concentric by
// construction.
export function Dock() {
  const pathname = usePathname()
  const activeHref =
    pathname === '/' ? '/' : ITEMS.find(({ href }) => pathname.startsWith(href))?.href
  const { dockRef, indicatorRef, registerItem, handleNavigate } = useDockActiveIndicator(activeHref)

  useDockGoShortcuts({
    activeHref,
    onNavigate: handleNavigate,
  })

  return (
    <nav
      ref={dockRef}
      className="dock"
      style={DOCK_VIEW_TRANSITION_STYLE}
      aria-label="Main navigation"
    >
      <DockGlass />
      <span ref={indicatorRef} className="dock-active-indicator" aria-hidden />
      <DockItem
        href="/"
        label="Home"
        goKey={dockGoKeyFor('/')}
        active={pathname === '/'}
        itemRef={(element) => registerItem('/', element)}
        onNavigate={handleNavigate}
      >
        <span className="dock-avatar">
          <Image src="/images/avatar.png" alt="" width={26} height={26} />
        </span>
      </DockItem>
      <span className="dock-rule" aria-hidden />
      {ITEMS.map(({ href, label, icon: Icon }) => (
        <DockItem
          key={href}
          href={href}
          label={label}
          goKey={dockGoKeyFor(href)}
          active={pathname.startsWith(href)}
          itemRef={(element) => registerItem(href, element)}
          onNavigate={handleNavigate}
        >
          <Icon />
        </DockItem>
      ))}
      <span className="dock-rule" aria-hidden />
      <Preferences />
    </nav>
  )
}
