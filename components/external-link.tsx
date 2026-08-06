'use client'

import { useState } from 'react'

import { ExternalLabel } from '~/components/external-mark'
import { Favicon } from '~/components/favicon'
import { SitePreviewCard } from '~/components/preview-card-timing'
import { ogImageUrl, type LinkPreview } from '~/lib/link-previews'
import { useLocale } from '~/lib/locale-client'

const HAN = /\p{Script=Han}/u

function englishOrSource(english: string | undefined, source: string | undefined) {
  if (english) return english
  return source && !HAN.test(source) ? source : undefined
}

// External prose links: inline favicon prefix, and — with build-time
// preview data and a fine pointer — a fixed-width hover card whose
// height adapts to its content. On touch the trigger is just a link;
// the card is an enhancement, never content.
export function ExternalLink({
  href,
  favicon,
  preview,
  children,
}: {
  href: string
  favicon: string
  preview?: LinkPreview
  children: React.ReactNode
}) {
  const locale = useLocale()
  const title = locale === 'en' ? englishOrSource(preview?.titleEn, preview?.title) : preview?.title
  const description =
    locale === 'en'
      ? englishOrSource(preview?.descriptionEn, preview?.description)
      : preview?.description
  const domain = preview?.domain
  // a failed Open Graph image degrades the card to its text form instead
  // of holding an empty frame with no description
  const [imageFailed, setImageFailed] = useState(false)
  const image = preview?.hasImage && !imageFailed ? ogImageUrl(href) : null
  const icon = <Favicon src={favicon} size={14} />

  if (!title || !domain) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="external-link">
        {icon}
        <ExternalLabel>{children}</ExternalLabel>
      </a>
    )
  }

  return (
    <SitePreviewCard
      href={href}
      target="_blank"
      rel="noreferrer"
      triggerClassName="external-link"
      closeDelay={100}
      popupClassName={`link-card${image ? ' link-card-with-image' : ''}`}
      popup={
        <>
          {image && (
            <span className="link-card-image-frame" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="link-card-image"
                src={image}
                alt=""
                width={236}
                height={133}
                loading="eager"
                onError={() => setImageFailed(true)}
              />
            </span>
          )}
          <span className="link-card-site">
            <Favicon src={favicon} size={16} />
            {domain}
          </span>
          <span className="link-card-title">{title}</span>
          {/* the image already says what the page is — description text
              only earns its rows on image-less cards */}
          {!image && description && (
            <span className="link-card-description">{description}</span>
          )}
        </>
      }
    >
      {icon}
      <ExternalLabel>{children}</ExternalLabel>
    </SitePreviewCard>
  )
}
