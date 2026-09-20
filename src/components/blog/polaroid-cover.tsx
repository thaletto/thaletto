import Image from 'next/image'

import type { PostCover } from '~/lib/content/posts'
import { tiltFromSlug } from '~/lib/motion/polaroid'
import { postViewTransitionName } from '~/lib/motion/view-transition-name'
import { cn } from '~/lib/platform/utils'

export function PolaroidCover({
  slug,
  cover,
  caption,
  alt,
  tilted = false,
  priority = false,
  morph = false,
  sizes,
  className,
  transitionName,
}: {
  slug: string
  cover: PostCover
  caption?: React.ReactNode
  /** image alt; captions may be decorative (e.g. braille) */
  alt?: string
  tilted?: boolean
  priority?: boolean
  /** shared-element morph across index ⇄ post navigation */
  morph?: boolean
  sizes?: string
  className?: string
  /** explicit shared-element name; defaults to the post-slug naming */
  transitionName?: string
}) {
  return (
    <figure
      className={cn('polaroid', tilted && 'polaroid-tilted', className)}
      style={
        {
          ...(tilted && { '--tilt': `${tiltFromSlug(slug)}deg` }),
          ...(morph && {
            viewTransitionName: transitionName ?? postViewTransitionName('cover', slug),
          }),
        } as React.CSSProperties
      }
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
