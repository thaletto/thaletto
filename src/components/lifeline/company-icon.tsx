import { Baby, School, University } from 'lucide-react'
import type { ComponentType } from 'react'
import { TcsLogo } from '~/components/brand/tcs-logo'
import { cn } from '~/lib/platform/utils'

export type CompanyIconId = string

export interface CompanyIconEntry {
  icon: ComponentType<{ className?: string }>
  /** Tailwind size for the mark — wordmarks want a wide box. */
  sizeClassName?: string
}

const companyIcons: Record<string, CompanyIconEntry> = {
  tcs: { icon: TcsLogo, sizeClassName: 'h-4 w-[25px]' },
  baby: { icon: Baby, sizeClassName: 'h-5 w-5' },
  school: { icon: School, sizeClassName: 'h-5 w-5' },
  university: { icon: University, sizeClassName: 'h-5 w-5' },
}

/** Renders the registered mark for `id`, or a fallback initial ring. */
export function CompanyIcon({
  id,
  label,
  className,
}: {
  id: CompanyIconId
  label: string
  className?: string
}) {
  const entry = companyIcons[id]

  if (entry) {
    const Icon = entry.icon
    return (
      <span
        role="img"
        className={cn(
          'inline-flex shrink-0 items-center justify-center text-black transition-colors duration-300 dark:text-white',
          entry.sizeClassName ?? 'h-4 w-4',
          className,
        )}
        aria-label={label}
        title={label}
      >
        <Icon className="h-full w-full" />
      </span>
    )
  }

  return (
    <span
      role="img"
      title={label}
      aria-label={label}
      className={cn(
        'inline-flex h-5 w-5 select-none items-center justify-center rounded-full text-[10px] font-semibold uppercase leading-none ring-1 ring-current/30',
        className,
      )}
    >
      {label.charAt(0)}
    </span>
  )
}
