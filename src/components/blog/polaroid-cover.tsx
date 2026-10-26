import Image from 'next/image'

import type { PostCover } from '~/lib/content/posts'

export function PolaroidCover({
  cover,
  alt,
  priority = false,
  sizes,
}: {
  cover: PostCover
  alt?: string
  priority?: boolean
  sizes?: string
}) {
  return (
    <figure className="polaroid">
      <span className="polaroid-photo">
        {cover.videoSrc ? (
          <video
            autoPlay
            className="w-full"
            height={cover.height}
            loop
            muted
            playsInline
            poster={cover.src}
            preload="metadata"
            src={cover.videoSrc}
            width={cover.width}
          />
        ) : (
          <Image
            src={cover.src}
            alt={alt ?? ''}
            width={cover.width}
            height={cover.height}
            priority={priority}
            sizes={sizes}
            className="w-full"
          />
        )}
      </span>
      <figcaption className="polaroid-caption">{cover.caption ?? ' '}</figcaption>
    </figure>
  )
}
