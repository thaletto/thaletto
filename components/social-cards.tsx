'use client'

import Image from 'next/image'

import { ExternalLabel } from '~/components/external-mark'
import { SitePreviewCard } from '~/components/preview-card-timing'

export interface SocialSnapshot {
  name: string
  handle: string
  bio?: string
  followers?: string
  following?: string
}

export interface GitHubSnapshot {
  user: string
  followers?: number
  total: number
  to: string
  levels: string
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

function Identity({
  data,
  avatar,
  service,
  withBio = true,
}: {
  data: SocialSnapshot
  avatar: string
  service: keyof typeof GLYPHS
  withBio?: boolean
}) {
  return (
    <>
      <span className="service-card-head">
        <Image
          src={avatar}
          alt=""
          width={40}
          height={40}
          className="service-card-avatar"
        />
        <span className="service-card-names">
          <span className="service-card-name">{data.name}</span>
          <span className="service-card-sub">@{data.handle}</span>
        </span>
        <Glyph service={service} />
      </span>
      {withBio && data.bio && (
        <span className="service-card-bio">{data.bio}</span>
      )}
    </>
  )
}

// Per-service hover cards for the chrome's social links. Server rendering
// supplies ISR-backed values with content/social.json and content/github.json
// as fallbacks; an open card never touches the network. Touch devices just
// follow the link. Bodies are exported separately so other triggers can serve
// the same cards.
export function XCardBody({ data }: { data: SocialSnapshot }) {
  return (
    <>
      <Identity
        data={data}
        avatar="/images/headshot.webp"
        service="x"
      />
      {(data.followers || data.following) && (
        <span className="service-card-stat">
          {data.following && (
            <span>
              <b>{data.following}</b> following
            </span>
          )}
          {data.followers && data.following && <span aria-hidden>·</span>}
          {data.followers && (
            <span>
              <b>{data.followers}</b> followers
            </span>
          )}
        </span>
      )}
    </>
  )
}

// Email's card is the front of a mailed envelope: stamps, cancellation
// marks, sender, recipient, and folded seams. Purely visual; the trigger
// itself opens mailto:.
export function LinkedInCardBody({ data }: { data: SocialSnapshot }) {
  return <Identity data={data} avatar="/images/headshot.webp" service="linkedin" />
}

export function GitHubCardBody({ data }: { data: GitHubSnapshot }) {
  const levels = data.levels.slice(-WEEKS * DAYS)
  return (
    <>
      <span className="contrib-grid" aria-hidden>
        {Array.from({ length: WEEKS }, (_, w) => (
          <span key={w} className="contrib-col">
            {Array.from({ length: DAYS }, (_, d) => {
              const i = w * DAYS + d
              return (
                <i
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
        {data.followers != null && (
          <>
            <span aria-hidden>·</span>
            <span>
              <b>{data.followers}</b> followers
            </span>
          </>
        )}
        <Glyph service="github" />
      </span>
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
          <span className="email-envelope-address">
            {address}
          </span>
        </span>
      }
    >
      {trigger}
    </SitePreviewCard>
  )
}
