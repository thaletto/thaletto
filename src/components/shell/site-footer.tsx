import { cacheLife } from 'next/cache'
import Link from 'next/link'

import { FooterClock } from '~/components/dock/footer-clock'
import { ExternalLabel } from '~/components/social/external-mark'
import {
  EmailCard,
  GitHubCard,
  type GitHubSnapshot,
  LinkedInCard,
  NotionCard,
  type NotionSnapshot,
  type SocialSnapshot,
  XCard,
} from '~/components/social/social-cards'
import { brailleText } from '~/lib/design/braille'

function Tree({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="footer-tree">
      <h2 className="footer-label">{label}</h2>
      <ul>{children}</ul>
    </div>
  )
}

async function CopyrightYear() {
  'use cache'
  cacheLife({ stale: 86_400, revalidate: 86_400, expire: 86_400 })

  return new Date().getFullYear()
}

// Swiss editorial footer, set as folder trees: each column is a directory
// listing with box-drawing connectors; the controls fill the column width
// (auto on mobile).
export function SiteFooter({
  social,
  github,
}: {
  social: { x: SocialSnapshot; linkedin: SocialSnapshot; notion: NotionSnapshot }
  github: GitHubSnapshot
}) {
  return (
    <footer className="mx-auto mt-24 w-full max-w-150 px-6 pb-24 text-sm text-muted-foreground sm:pb-12">
      <div className="hairline-top grid grid-cols-2 gap-x-6 gap-y-8 pt-8 sm:grid-cols-3">
        <Tree label="contact">
          <li>
            <XCard data={social.x} />
          </li>
          <li>
            <LinkedInCard data={social.linkedin} />
          </li>
          <li>
            <NotionCard data={social.notion} />
          </li>
          <li>
            <GitHubCard data={github} />
          </li>
          <li>
            <EmailCard address="krlaxman03@gmail.com" />
          </li>
        </Tree>
        <Tree label="index">
          <li>
            <Link href="/" className="footer-tree-link">
              Home
            </Link>
          </li>
          <li>
            <Link href="/projects" className="footer-tree-link">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/blog" className="footer-tree-link">
              Writing
            </Link>
          </li>
          <li>
            <Link href="/cv" className="footer-tree-link" target="_blank" rel="noreferrer">
              <ExternalLabel>Resume</ExternalLabel>
            </Link>
          </li>
        </Tree>
        <div className="footer-colophon col-span-2 sm:order-first sm:col-span-1">
          <div>
            <p>
              © <CopyrightYear /> Laxman K R
            </p>
            {/* the name echoed in braille — a printer's mark on the sheet */}
            <p className="footer-braille" aria-hidden>
              {brailleText('laxman k r')}
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <FooterClock />
            {/* geo stamp: the colophon's location line, a decorative twin of the clock */}
            <div className="footer-geo" aria-hidden>
              <svg className="footer-geo-globe" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="9" />
                <ellipse cx="10" cy="10" rx="4" ry="9" />
                <path d="M1 10h18M1.9 6h16.2M1.9 14h16.2" />
              </svg>
              <span className="footer-geo-lines">
                <span>13.0827° N</span>
                <span>80.2707° E</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
