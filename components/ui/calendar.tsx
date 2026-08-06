'use client'

import * as React from 'react'
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from 'react-day-picker'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

function calendarDayKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'group/calendar w-full bg-transparent [--cell-radius:var(--radius-md)] [--cell-size:2.75rem]',
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-full', defaultClassNames.root),
        months: cn('relative flex w-full flex-col gap-4', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          'size-[var(--cell-size)] select-none',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          'size-[var(--cell-size)] select-none',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex h-[var(--cell-size)] w-full items-center justify-center px-[var(--cell-size)]',
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          'flex h-[var(--cell-size)] w-full items-center justify-center gap-1.5 text-sm font-medium',
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn('relative rounded-lg', defaultClassNames.dropdown_root),
        dropdown: cn(
          'absolute inset-0 bg-popover opacity-0',
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          'select-none font-mono text-[13px] tabular-nums',
          captionLayout === 'label'
            ? ''
            : 'flex items-center gap-1 rounded-lg [&>svg]:size-3.5 [&>svg]:text-muted-foreground',
          defaultClassNames.caption_label,
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex-1 rounded-lg font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground select-none',
          defaultClassNames.weekday,
        ),
        week: cn('mt-1 flex w-full', defaultClassNames.week),
        week_number_header: cn(
          'w-[var(--cell-size)] select-none',
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          'font-mono text-[11px] text-muted-foreground select-none',
          defaultClassNames.week_number,
        ),
        day: cn(
          'group/day relative aspect-square h-full w-full rounded-lg p-0 text-center select-none',
          defaultClassNames.day,
        ),
        range_start: cn('relative isolate', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('relative isolate', defaultClassNames.range_end),
        today: cn('underline decoration-dotted underline-offset-4', defaultClassNames.today),
        outside: cn('text-muted-foreground', defaultClassNames.outside),
        disabled: cn('text-muted-foreground opacity-35', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...rootProps }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(className)}
            {...rootProps}
          />
        ),
        Chevron: ({ className, orientation, ...chevronProps }) => {
          if (orientation === 'left') {
            return <ChevronLeftIcon className={cn('size-4', className)} {...chevronProps} />
          }
          if (orientation === 'right') {
            return <ChevronRightIcon className={cn('size-4', className)} {...chevronProps} />
          }
          return <ChevronDownIcon className={cn('size-4', className)} {...chevronProps} />
        },
        PreviousMonthButton: ({ className, children, ...buttonProps }) => (
          <Button
            variant="ghost"
            size="icon"
            className={className}
            disabled={buttonProps['aria-disabled'] === true}
            {...buttonProps}
          >
            {children}
          </Button>
        ),
        NextMonthButton: ({ className, children, ...buttonProps }) => (
          <Button
            variant="ghost"
            size="icon"
            className={className}
            disabled={buttonProps['aria-disabled'] === true}
            {...buttonProps}
          >
            {children}
          </Button>
        ),
        DayButton: (dayButtonProps) => (
          <CalendarDayButton locale={locale} {...dayButtonProps} />
        ),
        WeekNumber: ({ children, ...weekNumberProps }) => (
          <td {...weekNumberProps}>
            <div className="flex size-[var(--cell-size)] items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant={modifiers.selected ? 'primary' : modifiers.available ? 'tertiary' : 'ghost'}
      size="icon"
      active={modifiers.selected}
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-day-key={calendarDayKey(day.date)}
      data-available={modifiers.available || undefined}
      className={cn(
        'aspect-square h-auto min-h-11 w-full min-w-[var(--cell-size)] font-mono text-[13px] tabular-nums',
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton, calendarDayKey }
