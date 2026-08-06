'use client'

import { classifyFaviconTone } from '~/components/favicon-tone'

function hideFailedImage(event: React.SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.dataset.failed = 'true'
}

export function Favicon({
  src,
  size,
  className,
}: {
  src: string
  size: number
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={(img) => {
        if (!img?.complete) return
        if (img.naturalWidth) classifyFaviconTone(img)
        else img.dataset.failed = 'true'
      }}
      className={className}
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      aria-hidden
      onLoad={(event) => classifyFaviconTone(event.currentTarget)}
      onError={hideFailedImage}
    />
  )
}
