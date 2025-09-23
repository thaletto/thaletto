import { cn } from "@/lib/utils";
import { AnimatePresence, motion, Variants, Variant } from "motion/react";
import React from "react";

export type RichTextEffectProps = {
  children: React.ReactNode[];
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  preset?: "blur" | "fade-in-blur" | "scale" | "fade" | "slide";
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  style?: React.CSSProperties;
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const presetVariants: Record<string, { container: Variants; item: Variants }> =
  {
    blur: {
      container: defaultContainerVariants,
      item: {
        hidden: { opacity: 0, filter: "blur(12px)" },
        visible: { opacity: 1, filter: "blur(0px)" },
        exit: { opacity: 0, filter: "blur(12px)" },
      },
    },
    "fade-in-blur": {
      container: defaultContainerVariants,
      item: {
        hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: 20, filter: "blur(12px)" },
      },
    },
    scale: {
      container: defaultContainerVariants,
      item: {
        hidden: { opacity: 0, scale: 0 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0 },
      },
    },
    fade: {
      container: defaultContainerVariants,
      item: defaultItemVariants,
    },
    slide: {
      container: defaultContainerVariants,
      item: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
      },
    },
  };

function hasTransition(variant: Variant): variant is { transition: any } {
  return (
    typeof variant === "object" && variant !== null && "transition" in variant
  );
}

export default function RichTextEffect({
  children,
  as = "span",
  className,
  preset = "fade",
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  style,
}: RichTextEffectProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.span;
  const baseVariants = presetVariants[preset] || presetVariants["fade"];
  const stagger = 0.05 / speedReveal;
  const baseDuration = 0.3 / speedSegment;

  const containerVariants = {
    ...baseVariants.container,
    visible: {
      ...baseVariants.container.visible,
      transition: {
        ...(hasTransition(baseVariants.container.visible)
          ? (baseVariants.container.visible as any).transition
          : {}),
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
    exit: {
      ...baseVariants.container.exit,
      transition: {
        ...(hasTransition(baseVariants.container.exit)
          ? (baseVariants.container.exit as any).transition
          : {}),
        staggerChildren: stagger,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    ...baseVariants.item,
    visible: {
      ...baseVariants.item.visible,
      transition: {
        ...(hasTransition(baseVariants.item.visible)
          ? (baseVariants.item.visible as any).transition
          : {}),
        duration: baseDuration,
      },
    },
    exit: {
      ...baseVariants.item.exit,
      transition: {
        ...(hasTransition(baseVariants.item.exit)
          ? (baseVariants.item.exit as any).transition
          : {}),
        duration: baseDuration,
      },
    },
  };

  return (
    <AnimatePresence mode="popLayout">
      <MotionTag
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className={className}
        style={style}
      >
        {children.map((child, i) => (
          <motion.span key={i} variants={itemVariants} className="inline-block">
            {child}
          </motion.span>
        ))}
      </MotionTag>
    </AnimatePresence>
  );
}
