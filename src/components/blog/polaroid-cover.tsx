import Image from 'next/image'

import { DitheredImage } from '~/components/visual/dither-veil'
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
  print = false,
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
  /** rest as an ink print (dither, or a dither/ascii/photo collage);
   * hover/focus develops the photo */
  print?: boolean | 'collage'
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
        {print ? (
          <DitheredImage
            src={cover.src}
            alt={alt ?? ''}
            width={cover.width}
            height={cover.height}
            preload={priority}
            sizes={sizes}
            className="w-full"
            ditherMode={print === 'collage' ? 'collage' : 'dither'}
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
      <figcaption className="polaroid-caption">{caption ?? cover.caption ?? ' '}</figcaption>
    </figure>
  )
}
