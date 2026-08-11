import { Children, type ReactNode } from 'react'
import { Grid2X2 } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '~/components/ui/empty'
import { cn } from '~/lib/platform/utils'

/** The desktop grid is four columns; narrow layouts collapse to two. */
const DESKTOP_COLUMN_COUNT = 4
const MOBILE_COLUMN_COUNT = 2
const FILLER_KEYS = ['filler-a', 'filler-b', 'filler-c'] as const

/** Props for one visible technology in a {@link TechStack}. */
export interface TechStackItemProps {
  /** SVG logo or other decorative visual. It is hidden from assistive technology. */
  children: ReactNode
  /** Accessible, visible technology name. */
  label: ReactNode
}

/**
 * Renders one semantic grid item with a decorative logo and its visible label.
 *
 * The label remains outside the `aria-hidden` icon wrapper so technology names
 * are announced even when their logos are not meaningful to a screen reader.
 */
export function TechStackItem({ children, label }: TechStackItemProps) {
  return (
    <li className="tech-stack-item">
      <span className="tech-stack-icon" aria-hidden="true">
        {children}
      </span>
      <span className="tech-stack-label">{label}</span>
    </li>
  )
}

/** Configuration for a reusable skills or project technology grid. */
export interface TechStackProps {
  /** One or more {@link TechStackItem} children. */
  children?: ReactNode
  /** Optional classes applied to the component root. */
  className?: string
  /** Supporting copy displayed when no items are supplied. */
  emptyDescription?: string
  /** Heading displayed when no items are supplied. */
  emptyTitle?: string
  /** Homepage section index, rendered only by the card variant. */
  index?: number | string
  /** Accessible grid name and card heading. */
  title?: string
  /** `card` includes the homepage heading; `embedded` is for existing MDX headings. */
  variant?: 'card' | 'embedded'
}

/** Returns filler cells needed to finish a row at the given breakpoint. */
function getFillerCount(itemCount: number, columnCount: number) {
  return itemCount === 0 ? 0 : (columnCount - (itemCount % columnCount)) % columnCount
}

/**
 * A semantic technology grid for the homepage and project MDX.
 *
 * Empty cells are decorative and explicitly hidden from assistive technology.
 * They preserve a stable four-column desktop grid while the mobile grid uses
 * only the filler required to complete its two-column final row.
 */
export function TechStack({
  children,
  className,
  emptyDescription = 'Add technologies, tools, and frameworks to showcase your toolkit.',
  emptyTitle = 'No skills added yet',
  index,
  title = 'Tech Stack',
  variant = 'card',
}: TechStackProps) {
  const itemCount = Children.count(children)
  const fillerCount = getFillerCount(itemCount, DESKTOP_COLUMN_COUNT)
  const mobileFillerCount = getFillerCount(itemCount, MOBILE_COLUMN_COUNT)
  const Root = variant === 'card' ? 'section' : 'div'

  return (
    <Root className={cn('tech-stack', className)} data-variant={variant}>
      {variant === 'card' && (
        <header className="tech-stack-header">
          <h2 className="section-tag">
            {index !== undefined && (
              <>
                <span className="section-tag-index" aria-hidden="true">
                  {String(index).padStart(2, '0')}
                </span>
                <span className="section-tag-hatch" aria-hidden="true" />
              </>
            )}
            <span className="section-tag-label">{title}</span>
          </h2>
        </header>
      )}

      {itemCount === 0 ? (
        <Empty className="tech-stack-empty">
          <EmptyHeader>
            <EmptyMedia className="tech-stack-empty-media">
              <Grid2X2 aria-hidden="true" strokeDasharray="3 3" />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="tech-stack-grid" aria-label={title}>
          {children}
          {FILLER_KEYS.slice(0, fillerCount).map((key, index) => (
            <li
              key={key}
              className={cn(
                'tech-stack-filler',
                index < mobileFillerCount && 'tech-stack-filler-mobile',
              )}
              aria-hidden="true"
            />
          ))}
        </ul>
      )}
    </Root>
  )
}
