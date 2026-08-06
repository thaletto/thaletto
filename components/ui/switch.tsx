"use client";

import { useId, type ReactNode } from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "~/lib/utils";

// CSS-only port of the fluid switch: Base UI owns the role="switch"
// semantics, keyboard toggling, and the hidden form input (via `name`);
// the thumb translates with a plain CSS transition on data-[checked] —
// no framer-motion drag machinery.

interface SwitchProps {
  /** Renders a min-h-11 label row; the switch is labelled via aria-labelledby. */
  label?: ReactNode;
  /** Accessible name for a switch without a visible label row. */
  "aria-label"?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

function Switch({
  label,
  "aria-label": ariaLabel,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  name,
  className,
}: SwitchProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const switchId = `${id}-switch`;

  const control = (
    <SwitchPrimitive.Root
      id={switchId}
      aria-labelledby={label ? labelId : undefined}
      aria-label={label ? undefined : ariaLabel}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      name={name}
      className={cn(
        // 34x20 track; the thumb travels 2px -> 16px inside it.
        "relative inline-flex h-5 w-[2.125rem] shrink-0 cursor-pointer items-center rounded-full outline-none",
        "bg-border transition-colors duration-150 data-[checked]:bg-foreground motion-reduce:transition-none",
        "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring,#6B97FF)]",
        "disabled:cursor-default disabled:opacity-50",
        !label && className
      )}
    >
      <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-background shadow-sm transition-transform duration-200 ease-[var(--ease-swift)] data-[checked]:translate-x-4 motion-reduce:transition-none" />
    </SwitchPrimitive.Root>
  );

  if (!label) return control;

  return (
    <div
      className={cn(
        "flex min-h-11 items-center justify-between gap-3",
        className
      )}
    >
      <label id={labelId} htmlFor={switchId} className="text-sm">
        {label}
      </label>
      {control}
    </div>
  );
}

Switch.displayName = "Switch";

export { Switch };
export type { SwitchProps };
