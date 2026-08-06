"use client";

import {
  Children,
  forwardRef,
  isValidElement,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  type ComponentType,
  type ReactNode,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "~/lib/utils";
import { useProximityHover } from "~/hooks/use-proximity-hover";
import { Elevated } from "~/lib/elevated";

type SelectIcon = ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

// ---------------------------------------------------------------------------
// Select context
//
// Built on Base UI's Select primitive, which owns positioning (collision
// flipping, anchor tracking), dismissal (outside press, focus-out, Escape
// nesting inside dialogs), list keyboard navigation + typeahead, combobox
// ARIA, and the hidden form input. The Fluid Functionalism layer keeps the
// proximity-hover overlays while selection and focus changes remain immediate.
// ---------------------------------------------------------------------------

interface SelectContextValue {
  value: string;
  open: boolean;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select compound components must be inside <Select>");
  return ctx;
}

// Content context for proximity hover
interface SelectContentContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
  checkedIndex?: number;
}

const SelectContentContext =
  createContext<SelectContentContextValue | null>(null);

// ---------------------------------------------------------------------------
// Select (root)
// ---------------------------------------------------------------------------

interface SelectProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  required?: boolean;
}

/**
 * Walk the children tree collecting `{ value, label }` pairs from SelectItem
 * elements. Passed to Base UI's `items` prop so the trigger can resolve the
 * label of an initial value before the popup has ever mounted (items only
 * render while open). Non-string labels fall back to the raw value, matching
 * the previous labelMap behaviour.
 */
function collectSelectItems(
  node: ReactNode,
  out: { value: string; label: ReactNode }[] = []
) {
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return;
    const props = child.props as { value?: unknown; children?: ReactNode };
    if (typeof props.value === "string") {
      out.push({
        value: props.value,
        label:
          typeof props.children === "string" ? props.children : props.value,
      });
    } else if (props.children) {
      collectSelectItems(props.children, out);
    }
  });
  return out;
}

function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  readOnly = false,
  name,
  required,
}: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const currentValue = value !== undefined ? value : internalValue;

  const items = useMemo(() => collectSelectItems(children), [children]);

  const handleValueChange = useCallback(
    (next: string | null) => {
      const v = next ?? "";
      if (value === undefined) setInternalValue(v);
      onValueChange?.(v);
    },
    [value, onValueChange]
  );

  const ctx = useMemo(
    () => ({ value: currentValue, open }),
    [currentValue, open]
  );

  return (
    <SelectContext.Provider value={ctx}>
      <SelectPrimitive.Root
        // Always controlled; "" (no selection) maps to Base UI's null.
        value={currentValue === "" ? null : currentValue}
        onValueChange={handleValueChange}
        open={open}
        onOpenChange={setOpen}
        items={items}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        required={required}
        // Non-modal: the page keeps scrolling and the Positioner tracks the
        // anchor, so the popup follows its trigger instead of detaching.
        modal={false}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
}

Select.displayName = "Select";

// ---------------------------------------------------------------------------
// SelectTrigger
// ---------------------------------------------------------------------------

const triggerVariants = cva(
  [
    "group relative inline-flex items-center justify-between gap-2 outline-none cursor-pointer",
    "min-w-24 text-[14px]",
    "transition-[background-color,color,border-color,box-shadow] duration-150",
    "disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:ring-1 focus-visible:ring-[color:var(--focus-ring)]",
  ],
  {
    variants: {
      variant: {
        bordered:
          "border border-border bg-transparent text-foreground hover:bg-hover",
        borderless:
          "border border-transparent bg-transparent text-foreground hover:bg-hover",
      },
      size: {
        // Control-row height (matches Button lg / subtle tabs); the pseudo
        // restores the 44px hit target without visible height.
        md: "h-8 px-2.5 before:absolute before:inset-x-0 before:top-1/2 before:h-11 before:-translate-y-1/2 before:content-['']",
        tall: "min-h-11 px-2",
      },
    },
    defaultVariants: {
      variant: "bordered",
      size: "md",
    },
  }
);

interface SelectTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof triggerVariants> {
  icon?: SelectIcon;
  placeholder?: string;
  error?: string;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    { className, variant, size, icon: Icon, placeholder = "Select…", error, ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1">
        <SelectPrimitive.Trigger
          ref={ref}
          aria-invalid={!!error || undefined}
          className={cn(
            triggerVariants({ variant, size }),
            "rounded-[20px]",
            error && "border-destructive/50 hover:border-destructive/50",
            className
          )}
          {...props}
        >
          <span className="flex items-center gap-2 min-w-0 flex-1">
            {Icon && (
              <Icon
                size={16}
                strokeWidth={1.5}
                className="shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
              />
            )}
            <SelectPrimitive.Value
              placeholder={placeholder}
              // py-1/-my-1: truncate's overflow:hidden clips at the padding
              // box, and the trimmed box excludes ascenders/descenders — the
              // padding gives glyphs room while the negative margin keeps the
              // trimmed layout box.
              className="min-w-0 flex-1 text-left truncate [text-box:trim-both_cap_alphabetic] py-1 -my-1 data-[placeholder]:text-muted-foreground"
            />
          </span>

          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </SelectPrimitive.Trigger>
        {error && (
          <span className="pl-3 text-[14px] text-destructive">{error}</span>
        )}
      </div>
    );
  }
);

SelectTrigger.displayName = "SelectTrigger";

// ---------------------------------------------------------------------------
// SelectContent
// ---------------------------------------------------------------------------

interface SelectContentProps {
  className?: string;
  children: ReactNode;
}

const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children }, ref) => {
    const { open, value } = useSelectContext();
    const containerRef = useRef<HTMLDivElement>(null);

    const {
      activeIndex,
      setActiveIndex,
      itemRects,
      handlers,
      registerItem,
      measureItems,
    } = useProximityHover(containerRef);

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [checkedIndex, setCheckedIndex] = useState<number | undefined>(
      undefined
    );

    // Measure items + detect the checked row once the popup has mounted.
    useEffect(() => {
      if (!open) return;
      // Double rAF: first waits for React commit, second for layout
      let inner: number;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => {
          measureItems();
          const container = containerRef.current;
          if (container) {
            const items = Array.from(
              container.querySelectorAll("[data-proximity-index]")
            ) as HTMLElement[];
            const idx = items.findIndex(
              (el) => el.getAttribute("data-value") === value
            );
            setCheckedIndex(idx !== -1 ? idx : undefined);
          }
        });
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }, [open, measureItems, value]);

    const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;
    const checkedRect = checkedIndex != null ? itemRects[checkedIndex] : null;
    const focusRect = focusedIndex !== null ? itemRects[focusedIndex] : null;
    const isHoveringOther =
      activeIndex !== null && activeIndex !== checkedIndex;

    const contentCtx = useMemo(
      () => ({ registerItem, activeIndex, checkedIndex }),
      [registerItem, activeIndex, checkedIndex]
    );

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          positionMethod="fixed"
          side="bottom"
          align="start"
          sideOffset={6}
          alignItemWithTrigger={false}
          className="z-[var(--z-card)] outline-none"
        >
          <div>
            <SelectContentContext.Provider value={contentCtx}>
              <SelectPrimitive.Popup
                render={
                  <Elevated
                    offset={2}
                    shadowLevel={3}
                    ref={(node: HTMLDivElement | null) => {
                      (
                        containerRef as React.MutableRefObject<HTMLDivElement | null>
                      ).current = node;
                      if (typeof ref === "function") ref(node);
                      else if (ref)
                        (
                          ref as React.MutableRefObject<HTMLDivElement | null>
                        ).current = node;
                    }}
                  />
                }
                onMouseEnter={() => {
                  handlers.onMouseEnter();
                  setFocusedIndex(null);
                }}
                onMouseMove={handlers.onMouseMove}
                onMouseLeave={handlers.onMouseLeave}
                onFocus={(e) => {
                  const indexAttr = (e.target as HTMLElement)
                    .closest("[data-proximity-index]")
                    ?.getAttribute("data-proximity-index");
                  if (indexAttr != null) {
                    const idx = Number(indexAttr);
                    setActiveIndex(idx);
                    setFocusedIndex(
                      (e.target as HTMLElement).matches(":focus-visible")
                        ? idx
                        : null
                    );
                  }
                }}
                onBlur={(e) => {
                  if (containerRef.current?.contains(e.relatedTarget as Node))
                    return;
                  setFocusedIndex(null);
                  setActiveIndex(null);
                }}
                className={cn(
                  // min-w tracks the trigger via the Positioner's --anchor-width
                  // var, matching the pre-migration minWidth: triggerRect.width.
                  "relative flex flex-col gap-0.5 min-w-[var(--anchor-width)] max-h-[min(300px,var(--available-height))] overflow-y-auto rounded-3xl p-1 select-none outline-none",
                  className
                )}
              >
                {/* Selected background */}
                {checkedRect && (
                  <div
                    className="absolute rounded-[20px] bg-active pointer-events-none"
                    style={{
                      top: checkedRect.top,
                      left: checkedRect.left,
                      width: checkedRect.width,
                      height: checkedRect.height,
                      opacity: isHoveringOther ? 0.8 : 1,
                    }}
                  />
                )}

                {/* Hover background */}
                {activeRect && (
                  <div
                    className="absolute rounded-[20px] bg-hover pointer-events-none"
                    style={{
                      top: activeRect.top,
                      left: activeRect.left,
                      width: activeRect.width,
                      height: activeRect.height,
                    }}
                  />
                )}

                {/* Focus ring */}
                {focusRect && (
                  <div
                    className="absolute rounded-[22px] pointer-events-none z-20 border border-[color:var(--focus-ring)]"
                    style={{
                      left: focusRect.left - 2,
                      top: focusRect.top - 2,
                      width: focusRect.width + 4,
                      height: focusRect.height + 4,
                    }}
                  />
                )}

                {children}
              </SelectPrimitive.Popup>
            </SelectContentContext.Provider>
          </div>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    );
  }
);

SelectContent.displayName = "SelectContent";

// ---------------------------------------------------------------------------
// SelectItem
// ---------------------------------------------------------------------------

interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  icon?: SelectIcon;
  index: number;
  value: string;
  disabled?: boolean;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  (
    {
      className,
      children,
      icon: Icon,
      value,
      index,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const selectCtx = useSelectContext();
    const contentCtx = useContext(SelectContentContext);
    const internalRef = useRef<HTMLDivElement>(null);

    // Register with proximity hover
    useEffect(() => {
      contentCtx?.registerItem(index, internalRef.current);
      return () => contentCtx?.registerItem(index, null);
    }, [index, contentCtx]);

    const isActive = contentCtx?.activeIndex === index;
    const isChecked = selectCtx.value === value;

    return (
      <SelectPrimitive.Item
        value={value}
        disabled={disabled}
        label={typeof children === "string" ? children : undefined}
        render={
          <div
            ref={(node: HTMLDivElement | null) => {
              (
                internalRef as React.MutableRefObject<HTMLDivElement | null>
              ).current = node;
              if (typeof ref === "function") ref(node);
              else if (ref)
                (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                  node;
            }}
            data-proximity-index={index}
            data-value={value}
            className={cn(
              // Fixed height (was py-2 around a 19.5px line box ≈ 35.5px) so
              // the text-box trim on the item text doesn't shrink the row.
              // shrink-0 is load-bearing: the popup is a flex column, so a
              // long list (every IANA zone) would otherwise squash every
              // row well under its 44px target.
              "relative z-10 flex h-11 shrink-0 items-center gap-2 rounded-[20px] px-2 text-[14px] cursor-pointer outline-none select-none",
              isActive || isChecked
                ? "text-foreground"
                : "text-muted-foreground",
              disabled && "opacity-50 pointer-events-none",
              className
            )}
            {...props}
          />
        }
      >
        {Icon && (
          <Icon
            size={16}
            strokeWidth={1.5}
            className="shrink-0"
          />
        )}

        <SelectPrimitive.ItemText
          // py-1/-my-1 keeps truncate's overflow:hidden from clipping
          // ascenders/descenders outside the trimmed box.
          render={<span className="flex-1 min-w-0 truncate [text-box:trim-both_cap_alphabetic] py-1 -my-1" />}
        >
          {children}
        </SelectPrimitive.ItemText>

        {isChecked && (
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-foreground"
            >
              <path d="M4 12L9 17L20 6" />
            </svg>
        )}
      </SelectPrimitive.Item>
    );
  }
);

SelectItem.displayName = "SelectItem";

// ---------------------------------------------------------------------------
// SelectGroup + SelectLabel + SelectSeparator
// ---------------------------------------------------------------------------

function SelectGroup({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="group" className={className} {...props}>
      {children}
    </div>
  );
}

SelectGroup.displayName = "SelectGroup";

const SelectLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-[14px] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);

SelectLabel.displayName = "SelectLabel";

const SelectSeparator = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn("my-1 -mx-1 h-px bg-border/60", className)}
    {...props}
  />
));

SelectSeparator.displayName = "SelectSeparator";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  triggerVariants,
};

export type { SelectProps, SelectTriggerProps, SelectContentProps, SelectItemProps };
