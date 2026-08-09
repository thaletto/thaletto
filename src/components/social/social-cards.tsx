'use client'

import Image from 'next/image'

import { ExternalLabel } from '~/components/social/external-mark'
import { SitePreviewCard } from '~/components/social/preview-card-timing'

export interface SocialSnapshot {
  name: string
  handle: string
  bio?: string
}

export interface GitHubSnapshot {
  user: string
  followers?: number
  total: number
  to: string
  levels: string
}

export interface NotionSnapshot {
  name: string
  url: string
  bio?: string
}

// heatmap shows the recent ~180 days (26 weeks); the stat below still
// counts the full past year
const WEEKS = 26
const DAYS = 7

export const GLYPHS: Record<string, { path: string; color?: string }> = {
  x: {
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  linkedin: {
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
    color: '#0A66C2',
  },
  github: {
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
}

function Glyph({ service }: { service: keyof typeof GLYPHS }) {
  const { path, color } = GLYPHS[service]
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden
      className="service-card-glyph"
      style={color ? { color } : undefined}
    >
      <path fill="currentColor" d={path} />
    </svg>
  )
}

// Notion's mark is a two-part cutout, so it lives as its own svg rather than
// a single 24×24 path in GLYPHS. The white backing plate is dropped: on the
// service card the letterform renders in currentColor alone.
function NotionMark({
  className,
  width = 16,
  height = 16,
}: {
  className?: string
  width?: number
  height?: number
}) {
  return (
    <svg viewBox="0 0 256 268" width={width} height={height} aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M164.09.608 16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608ZM69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095l-1.819.125Zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921ZM212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404l35.84-2.087Z"
      />
    </svg>
  )
}

function Card({
  trigger,
  href,
  children,
  className,
  triggerClassName = 'footer-tree-link',
}: {
  trigger: React.ReactNode
  href: string
  children: React.ReactNode
  className: string
  triggerClassName?: string
}) {
  return (
    <SitePreviewCard
      href={href}
      target="_blank"
      rel="noreferrer"
      triggerClassName={triggerClassName}
      closeDelay={120}
      popupClassName={className}
      popup={children}
      side="top"
    >
      <ExternalLabel>{trigger}</ExternalLabel>
    </SitePreviewCard>
  )
}

// One shared plate for every social card: a lead slot (photo avatar for
// profile services, a monogram tile for mark-only services like Notion),
// name + sub-line, the trailing service glyph, and an optional bio.
// Callers own the lead element so nothing here branches on service.
// The trailing glyph is optional: mark-led leads already carry the mark.
function Identity({
  name,
  sub,
  bio,
  lead,
  service,
}: {
  name: string
  sub: string
  bio?: string
  lead: React.ReactNode
  service?: keyof typeof GLYPHS
}) {
  return (
    <>
      <span className="service-card-head">
        {lead}
        <span className="service-card-names">
          <span className="service-card-name">{name}</span>
          <span className="service-card-sub">{sub}</span>
        </span>
        {service && <Glyph service={service} />}
      </span>
      {bio && <span className="service-card-bio">{bio}</span>}
    </>
  )
}

// Per-service hover cards for the chrome's social links. Server rendering
// supplies ISR-backed values with src/content/social.json and src/content/github.json
// as fallbacks; an open card never touches the network. Touch devices just
// follow the link. Bodies are exported separately so other triggers can serve
// the same cards.
// X has no public follower endpoint; the card is static identity only.
export function XCardBody({ data }: { data: SocialSnapshot }) {
  return (
    <Identity
      name={data.name}
      sub={`@${data.handle}`}
      bio={data.bio}
      lead={
        <Image
          src="/images/headshot.webp"
          alt=""
          width={40}
          height={40}
          className="service-card-avatar"
        />
      }
      service="x"
    />
  )
}

export function LinkedInCardBody({ data }: { data: SocialSnapshot }) {
  return (
    <Identity
      name={data.name}
      sub={`@${data.handle}`}
      bio={data.bio}
      lead={
        <Image
          src="/images/headshot.webp"
          alt=""
          width={40}
          height={40}
          className="service-card-avatar"
        />
      }
      service="linkedin"
    />
  )
}

// Notion has no account to photograph: the cutout mark itself sits in the
// lead slot, and the sub-line carries the workspace domain instead of a
// handle. Same plate as the profile cards — only the lead and sub differ.
export function NotionCardBody({ data }: { data: NotionSnapshot }) {
  return (
    <Identity
      name={data.name}
      sub="laxmankr.notion.site"
      bio={data.bio}
      lead={
        <span className="service-card-logo" aria-hidden>
          <NotionMark width={20} height={20} />
        </span>
      }
    />
  )
}

export function GitHubCardBody({ data }: { data: GitHubSnapshot }) {
  const levels = data.levels.slice(-WEEKS * DAYS)
  return (
    <>
      <span className="contrib-grid" aria-hidden>
        {Array.from({ length: WEEKS }, (_, w) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: deterministic week grid, static size
          <span key={w} className="contrib-col">
            {Array.from({ length: DAYS }, (_, d) => {
              const i = w * DAYS + d
              return (
                <i
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed 7-day layout, index is the render slot
                  key={d}
                  data-level={levels[i] ?? '0'}
                  style={{ '--ci': i } as React.CSSProperties}
                />
              )
            })}
          </span>
        ))}
      </span>
      <span className="service-card-stat">
        <span>
          <b>{data.total.toLocaleString()}</b> contributions
        </span>
        <Glyph service="github" />
      </span>
      {data.followers != null && (
        <span className="service-card-stat service-card-stat-below">
          <b>{data.followers}</b> followers
        </span>
      )}
    </>
  )
}

export function XCard({
  data,
  trigger = 'X/Twitter',
  triggerClassName,
}: {
  data: SocialSnapshot
  trigger?: React.ReactNode
  triggerClassName?: string
}) {
  return (
    <Card
      trigger={trigger}
      href={`https://x.com/${data.handle}`}
      className="link-card service-card"
      triggerClassName={triggerClassName}
    >
      <XCardBody data={data} />
    </Card>
  )
}

export function LinkedInCard({
  data,
  trigger = 'LinkedIn',
  triggerClassName,
}: {
  data: SocialSnapshot
  trigger?: React.ReactNode
  triggerClassName?: string
}) {
  return (
    <Card
      trigger={trigger}
      href={`https://www.linkedin.com/in/${data.handle}`}
      className="link-card service-card"
      triggerClassName={triggerClassName}
    >
      <LinkedInCardBody data={data} />
    </Card>
  )
}

export function NotionCard({
  data,
  trigger = 'Notion',
  triggerClassName,
}: {
  data: NotionSnapshot
  trigger?: React.ReactNode
  triggerClassName?: string
}) {
  return (
    <Card
      trigger={trigger}
      href={data.url}
      className="link-card service-card"
      triggerClassName={triggerClassName}
    >
      <NotionCardBody data={data} />
    </Card>
  )
}

export function GitHubCard({
  data,
  trigger = 'GitHub',
  triggerClassName,
}: {
  data: GitHubSnapshot
  trigger?: React.ReactNode
  triggerClassName?: string
}) {
  return (
    <Card
      trigger={trigger}
      href={`https://github.com/${data.user}`}
      className="link-card service-card"
      triggerClassName={triggerClassName}
    >
      <GitHubCardBody data={data} />
    </Card>
  )
}

// Email's card is the front of a mailed envelope: stamps, cancellation
// marks, sender, recipient, and folded seams. Purely visual; the trigger
// itself opens mailto:.
export function EmailCard({
  address,
  trigger = 'Email',
  triggerClassName = 'footer-tree-link',
}: {
  address: string
  trigger?: React.ReactNode
  triggerClassName?: string
}) {
  return (
    <SitePreviewCard
      href={`mailto:${address}`}
      triggerClassName={triggerClassName}
      closeDelay={120}
      popupClassName="link-card email-envelope-card"
      side="top"
      popup={
        <span className="email-envelope" aria-hidden>
          <span className="email-envelope-flap" />
          <span className="email-envelope-return">
            <span>TO</span>
            LAXMAN K R
            <br />
            INDIA
          </span>
          <span className="email-envelope-stamps">
            <span className="email-envelope-stamp email-envelope-stamp-portrait">
              <Image src="/images/avatar.png" alt="" width={32} height={32} />
              <span>LAXMAN · 22</span>
            </span>
            <span className="email-envelope-stamp email-envelope-stamp-mark">
              <span className="email-envelope-stamp-star">&#10022;</span>
              <span>POST · 26</span>
            </span>
          </span>
          <span className="email-envelope-postmark" />
          <span className="email-envelope-address">{address}</span>
        </span>
      }
    >
      {trigger}
    </SitePreviewCard>
  )
}
