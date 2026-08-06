import Link from 'next/link'

// Admin wayfinding: surfaces are menus of catalog rows that go one level
// deeper, and every subpage carries a back mark to its parent. Structure
// comes from depth, not from stacking every section on one screen.

/**
 * A menu row: label, dotted leader, and the surface's own summary value —
 * the same catalog grammar the Overview uses.
 */
export function AdminMenuRow({
  href,
  label,
  value,
  destructive = false,
}: {
  href: string
  label: React.ReactNode
  value: React.ReactNode
  destructive?: boolean
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex min-h-11 items-center gap-3 py-1.5 text-sm outline-none focus-visible:rounded-sm focus-visible:ring-1 focus-visible:ring-foreground"
      >
        <span className="shrink-0">{label}</span>
        <span aria-hidden="true" className="blog-row-leader" />
        <span
          className={`shrink-0 text-right tabular-nums ${
            destructive ? 'text-destructive' : 'text-muted-foreground'
          }`}
        >
          {value}
        </span>
      </Link>
    </li>
  )
}

export function AdminMenu({ children }: { children: React.ReactNode }) {
  return <ul className="mt-6 hairline-top pt-4">{children}</ul>
}

/** The back mark above a subpage's header, in the eyebrow's mono register. */
export function AdminBackLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground outline-none transition-colors duration-150 hover:text-foreground focus-visible:rounded-sm focus-visible:ring-1 focus-visible:ring-foreground motion-reduce:transition-none"
    >
      <span aria-hidden>←</span>
      {children}
    </Link>
  )
}
