"use client";

import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Button, type ButtonProps } from "~/components/ui/button";
import { ScrollAreaY } from "~/components/ui/scroll-area";
import { Elevated } from "~/lib/elevated";
import { useSurface } from "~/lib/surface-context";
import { cn } from "~/lib/utils";

// ---------------------------------------------------------------------------
// Dialog
//
// Built on Base UI's Dialog primitive, which owns focus trapping, dismissal
// (outside press, Escape nesting), and deferred unmount driven by the CSS
// transition on its data-[starting-style]/data-[ending-style] attributes —
// no framer-motion, no actionsRef machinery. The popup rides the surface
// ladder via Elevated (dialog convention: offset 4, shadow 4), and DialogBody
// gives tall content a vertical scroll region with edge fades between the
// fixed header and footer.
// ---------------------------------------------------------------------------

function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

Dialog.displayName = "Dialog";

function DialogTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

DialogTrigger.displayName = "DialogTrigger";

// ---------------------------------------------------------------------------
// DialogContent
// ---------------------------------------------------------------------------

interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Popup> {
  size?: "sm" | "lg";
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ size = "lg", className, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-[var(--z-card)] bg-background/70 backdrop-blur-[6px] transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
      <DialogPrimitive.Popup
        ref={ref}
        render={<Elevated offset={4} shadowLevel={4} />}
        className={cn(
          // The blueprint sheet: the register's 2px corner and hairline
          // frame (the printed-label chrome hover cards use), with ruled
          // head/foot rows from DialogHeader/DialogFooter. The panel is
          // translucent over a blurred backdrop — the sheet sits *on* the
          // page rather than replacing it (dialog-glass keeps the ladder's
          // surface color but drops its alpha). Flex column so DialogBody
          // scrolls between them; exit runs at ~2/3 of the enter duration.
          "dialog-glass fixed left-1/2 top-1/2 z-[var(--z-card)] flex max-h-[85dvh] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[2px] border border-border outline-none transition-[opacity,transform] duration-200 ease-[var(--ease-swift)] data-[ending-style]:duration-[133ms] data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 motion-reduce:transition-none",
          size === "sm"
            ? "w-[min(25rem,calc(100vw-2rem))]"
            : "w-[min(34rem,calc(100vw-2rem))]",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
);

DialogContent.displayName = "DialogContent";

// ---------------------------------------------------------------------------
// DialogHeader + DialogBody + DialogFooter
// ---------------------------------------------------------------------------

/** The ruled head row — a full-bleed hairline separates it from the body. */
function DialogHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-baseline justify-between gap-4 border-b border-border px-5 pb-3 pt-4",
        className
      )}
      {...props}
    />
  );
}

DialogHeader.displayName = "DialogHeader";

interface DialogBodyProps {
  className?: string;
  children: ReactNode;
}

/** The scrollable region between the fixed header and footer. */
function DialogBody({ className, children }: DialogBodyProps) {
  // Tint the edge fades with the dialog's own surface so continuation
  // reads seamlessly (the substrate here is the Elevated popup's level).
  const surface = Math.round(Math.max(1, Math.min(8, useSurface())));
  return (
    <ScrollAreaY
      className="min-h-0 flex-1"
      style={
        { "--scroll-fade-surface": `var(--surface-${surface})` } as CSSProperties
      }
    >
      <div className={cn("px-5 py-4", className)}>{children}</div>
    </ScrollAreaY>
  );
}

DialogBody.displayName = "DialogBody";

/** The ruled foot row, mirroring the head. */
function DialogFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3",
        className
      )}
      {...props}
    />
  );
}

DialogFooter.displayName = "DialogFooter";

// ---------------------------------------------------------------------------
// DialogTitle + DialogDescription + DialogClose
// ---------------------------------------------------------------------------

function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

DialogTitle.displayName = "DialogTitle";

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("px-5 pt-3 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

DialogDescription.displayName = "DialogDescription";

/** Closes the dialog; renders the shared Button (ghost, sm) by default. */
function DialogClose({
  variant = "ghost",
  size = "sm",
  children,
  ...props
}: ButtonProps) {
  return (
    <DialogPrimitive.Close
      render={
        <Button variant={variant} size={size} {...props}>
          {children}
        </Button>
      }
    />
  );
}

DialogClose.displayName = "DialogClose";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};

export type { DialogContentProps, DialogBodyProps };
