import Image from 'next/image'

import type { PostCover } from '~/lib/content/posts'
import { tiltFromSlug } from '~/lib/motion/polaroid'
import { cn } from '~/lib/platform/utils'

export function PolaroidCover({
  slug,
  cover,
  caption,
  alt,
  tilted = false,
  priority = false,
  sizes,
  className,
}: {
  slug: string
  cover: PostCover
  caption?: React.ReactNode
  /** image alt; captions may be decorative (e.g. braille) */
  alt?: string
  tilted?: boolean
  priority?: boolean
  sizes?: string
  className?: string
}) {
  return (
    <figure
      className={cn('polaroid', tilted && 'polaroid-tilted', className)}
      style={{ ...(tilted && { '--tilt': `${tiltFromSlug(slug)}deg` }) } as React.CSSProperties}
    >
      <span className="polaroid-photo">
        <Image
          src={cover.src}
          alt={alt ?? ''}
          width={cover.width}
          height={cover.height}
          priority={priority}
          sizes={sizes}
          className="w-full"
        />
      </span>
      <figcaption className="polaroid-caption">{caption ?? cover.caption ?? ' '}</figcaption>
    </figure>
  )
}
