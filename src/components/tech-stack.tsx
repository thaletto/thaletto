import { Children, type ReactNode } from 'react'

const COLUMN_COUNT = 4
const FILLER_KEYS = ['filler-a', 'filler-b', 'filler-c'] as const

interface TechStackItemProps {
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

interface TechStackProps {
  children?: ReactNode
  title?: string
}

function getFillerCount(itemCount: number, columnCount: number) {
  return itemCount === 0 ? 0 : (columnCount - (itemCount % columnCount)) % columnCount
}

export function TechStack({ children, title = 'Tech Stack' }: TechStackProps) {
  const fillerCount = getFillerCount(Children.count(children), COLUMN_COUNT)

  return (
    <ul className="tech-stack-grid" aria-label={title}>
      {children}
      {FILLER_KEYS.slice(0, fillerCount).map((key) => (
        <li key={key} className="tech-stack-filler" aria-hidden="true" />
      ))}
    </ul>
  )
}
