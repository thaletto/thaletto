import { Grid2X2 } from 'lucide-react'
import { Children, type ReactNode } from 'react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '~/components/ui/empty'
import { cn } from '~/lib/platform/utils'

const COLUMN_COUNT = 4
const FILLER_KEYS = ['filler-a', 'filler-b', 'filler-c'] as const

export interface TechStackItemProps {
  children: ReactNode
  label: ReactNode
}

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

export interface TechStackProps {
  children?: ReactNode
  className?: string
  emptyDescription?: string
  emptyTitle?: string
  index?: number | string
  title?: string
  variant?: 'card' | 'embedded'
}

function getFillerCount(itemCount: number, columnCount: number) {
  return itemCount === 0 ? 0 : (columnCount - (itemCount % columnCount)) % columnCount
}

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
  const fillerCount = getFillerCount(itemCount, COLUMN_COUNT)
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
            <span className="align-center">{title}</span>
          </h2>
        </header>
      )}

      {itemCount === 0 ? (
        <Empty className="min-h-60 rounded-none">
          <EmptyHeader>
            <EmptyMedia className="mb-1 size-10 text-muted-foreground [&_svg]:size-full">
              <Grid2X2 aria-hidden="true" strokeDasharray="3 3" />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="tech-stack-grid" aria-label={title}>
          {children}
          {FILLER_KEYS.slice(0, fillerCount).map((key) => (
            <li key={key} className="tech-stack-filler" aria-hidden="true" />
          ))}
        </ul>
      )}
    </Root>
  )
}
