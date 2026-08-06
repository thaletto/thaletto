import { cn } from '~/lib/utils'

// The section-tag register from the public homepage h2s — index cell,
// hazard-hatch chip, and uppercase mono label — as a shared component.
// Rendered statically: no entrance class here; public callers that want
// `.enter` keep their own inline markup.
export function SectionTag({
  index,
  id,
  className,
  children,
}: {
  index: number
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <h2 id={id} className={cn('section-tag', className)}>
      <span className="section-tag-index" aria-hidden>
        {String(index).padStart(2, '0')}
      </span>
      <span className="section-tag-hatch" aria-hidden />
      <span className="section-tag-label">{children}</span>
    </h2>
  )
}
