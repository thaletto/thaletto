"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "~/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Renders a wrapping label above the control (14px muted). */
  label?: ReactNode;
  /** 14px destructive text below the control, wired via aria-describedby. */
  error?: ReactNode;
  /** Destructive border treatment without an error message. Implied when
   *  `error` is set. */
  destructive?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      destructive = false,
      className,
      id,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const errorId = `${id ?? autoId}-error`;
    const isDestructive = destructive || !!error;

    const control = (
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error
            ? [ariaDescribedBy, errorId].filter(Boolean).join(" ")
            : ariaDescribedBy
        }
        className={cn(
          // text-base (16px) keeps iOS Safari from zooming on focus; h-8 is
          // the shared 32px control height (Button lg, subtle tabs, selects).
          "block h-8 w-full rounded-lg border border-border bg-transparent px-2.5 text-base text-foreground outline-none",
          "placeholder:text-muted-foreground",
          "transition-colors duration-150 motion-reduce:transition-none",
          "focus:border-foreground focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring)]",
          "disabled:opacity-50",
          isDestructive && "border-destructive focus:border-destructive",
          className
        )}
        {...props}
      />
    );

    if (!label && !error) return control;

    const errorText = error ? (
      <span id={errorId} className="text-sm text-destructive">
        {error}
      </span>
    ) : null;

    if (label) {
      return (
        <label className="grid gap-1.5 text-sm text-muted-foreground">
          {label}
          {control}
          {errorText}
        </label>
      );
    }

    return (
      <div className="grid gap-1.5">
        {control}
        {errorText}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
