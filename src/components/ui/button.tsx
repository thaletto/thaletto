'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  type ButtonHTMLAttributes,
  type ComponentType,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '~/lib/platform/utils'

type ButtonIcon = ComponentType<{
  size?: number
  strokeWidth?: number
  className?: string
}>

const buttonVariants = cva(
  [
    'group relative isolate inline-flex items-center justify-center rounded-full text-[12px] outline-none cursor-pointer',
    'disabled:opacity-50 disabled:pointer-events-none',
    'focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]',
  ],
  {
    variants: {
      variant: {
        primary: 'text-background',
        secondary: 'text-foreground',
        tertiary: 'border border-border text-foreground',
        ghost: 'text-muted-foreground hover:text-foreground',
      },
      size: {
        sm: 'h-6 px-2 gap-1',
        md: 'h-7 px-2 gap-1.5',
        // The public CTA register (.btn-cta): 36px pill, 14px medium label,
        // 18px inline padding. lg is the prominent-action tier everywhere,
        // so it carries the same metrics.
        lg: 'h-9 px-[1.125rem] gap-2 text-sm font-medium',
        'icon-sm': 'h-6 w-6 [&_svg]:h-3.5 [&_svg]:w-3.5',
        icon: 'h-7 w-7 [&_svg]:h-4 [&_svg]:w-4',
        'icon-lg': 'h-8 w-8 [&_svg]:h-5 [&_svg]:w-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** When true, the given single React-element child becomes the rendered element (slot-style). */
  asChild?: boolean
  loading?: boolean
  leadingIcon?: ButtonIcon
  trailingIcon?: ButtonIcon
  /** Force the visual pressed/held state. Useful when the button drives an
   *  external open piece of UI (a popover, dropdown, etc.) so it reads as
   *  engaged while the menu is showing. */
  active?: boolean
  /** Destructive tone: primary becomes a filled destructive pill; the other
   *  variants read destructive ink with a destructive-tinted hover. The focus
   *  ring stays neutral — signal color never marks focus. */
  destructive?: boolean
  /** Restore the 44px minimum hit target with a pseudo-element when the
   *  visible pill is shorter (the .btn-cta::before recipe). Only for buttons
   *  with ≥16px vertical clearance — never in dense stacked rows. */
  expandHitArea?: boolean
}

const bgVariants: Record<string, string> = {
  primary: 'bg-foreground group-hover:bg-foreground/90 group-active:bg-foreground/80',
  secondary: 'bg-accent group-hover:bg-accent/80 group-active:bg-accent',
  tertiary: 'bg-transparent group-hover:bg-hover group-active:bg-active',
  ghost: 'bg-transparent group-hover:bg-hover group-active:bg-active',
}

const activeBgVariants: Record<string, string> = {
  primary: 'bg-foreground/80',
  secondary: 'bg-accent',
  tertiary: 'bg-active',
  ghost: 'bg-active',
}

// Destructive tone. Filled primary mirrors the foreground recipe on
// bg-destructive (label matches the existing bg-destructive/text-white
// admin confirms); the quieter variants keep destructive ink over a
// /10-alpha tinted hover.
const destructiveRootVariants: Record<string, string> = {
  primary: 'text-white',
  secondary: 'text-destructive',
  tertiary: 'text-destructive',
  ghost: 'text-destructive hover:text-destructive',
}

const destructiveBgVariants: Record<string, string> = {
  primary: 'bg-destructive group-hover:bg-destructive/90 group-active:bg-destructive/80',
  secondary: 'bg-destructive/10 group-hover:bg-destructive/15 group-active:bg-destructive/20',
  tertiary: 'bg-transparent group-hover:bg-destructive/10 group-active:bg-destructive/15',
  ghost: 'bg-transparent group-hover:bg-destructive/10 group-active:bg-destructive/15',
}

const destructiveActiveBgVariants: Record<string, string> = {
  primary: 'bg-destructive/80',
  secondary: 'bg-destructive/20',
  tertiary: 'bg-destructive/15',
  ghost: 'bg-destructive/15',
}

// Vertical-only hit-target extension to 44px (mirrors .btn-cta::before).
const expandHitAreaClasses =
  "before:absolute before:inset-x-0 before:top-1/2 before:h-11 before:-translate-y-1/2 before:content-['']"

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      active = false,
      destructive = false,
      expandHitArea = false,
      disabled,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    // asChild: the user's element becomes the root while the button's internal
    // structure (bg layer, content wrapper, icons) survives as its
    // children — the element's own children become the label. We clone the
    // element directly instead of routing through ButtonPrimitive's `render`:
    // Base UI would bolt button semantics (role="button", Space activation)
    // onto e.g. a link, diverging from the Radix flavour's plain-link output.
    const asChildElement =
      asChild && isValidElement(children)
        ? (children as ReactElement<{
            children?: ReactNode
            className?: string
            style?: React.CSSProperties
            ref?: React.Ref<HTMLButtonElement>
          }>)
        : null
    const label = asChildElement ? asChildElement.props.children : children
    const isIconOnly = size === 'icon' || size === 'icon-sm' || size === 'icon-lg'
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14
    const bgClass = active
      ? (destructive ? destructiveActiveBgVariants : activeBgVariants)[variant ?? 'primary']
      : (destructive ? destructiveBgVariants : bgVariants)[variant ?? 'primary']

    const internals = (
      <>
        <span
          aria-hidden
          className={cn('absolute inset-0 rounded-[inherit]', bgClass)}
        />
        <span className="relative inline-flex items-center justify-center gap-[inherit]">
          {isIconOnly ? (
            <span className="[&_svg]:stroke-[1.5]">{label}</span>
          ) : (
            <>
              {LeadingIcon && <LeadingIcon size={iconSize} strokeWidth={1.5} />}
              {/* text-box only applies to block containers, so the trim lives
                  on the label span (a blockified flex item), not the flex root.
                  Height comes from padding + type; this centers the
                  cap-to-baseline box optically. */}
              <span className="[text-box:trim-both_cap_alphabetic]">{label}</span>
              {TrailingIcon && <TrailingIcon size={iconSize} strokeWidth={1.5} />}
            </>
          )}
        </span>
      </>
    )

    const rootClassName = cn(
      buttonVariants({
        variant,
        size,
      }),
      destructive && destructiveRootVariants[variant ?? 'primary'],
      expandHitArea && expandHitAreaClasses,
      LeadingIcon && !isIconOnly && 'ps-1.5',
      TrailingIcon && !isIconOnly && 'pe-1.5',
      className,
    )

    if (asChildElement) {
      const childProps = asChildElement.props
      return cloneElement(
        asChildElement,
        {
          ...props,
          ref,
          className: cn(rootClassName, childProps.className),
          style: { ...style, ...childProps.style },
        },
        internals,
      )
    }

    return (
      <ButtonPrimitive
        // Base UI's `ButtonPrimitive` forwards to an HTMLButtonElement;
        // keep the public ref type narrow so consumers see the right type.
        ref={ref as React.Ref<HTMLButtonElement>}
        className={rootClassName}
        disabled={disabled || loading}
        style={style}
        {...props}
      >
        {internals}
      </ButtonPrimitive>
    )
  },
)

Button.displayName = 'Button'

export type { ButtonProps }
export { Button }
