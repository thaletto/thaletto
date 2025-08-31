"use client";
import { motion, HTMLMotionProps } from "motion/react";

export function MotionDiv(props: HTMLMotionProps<"div">) {
  return <motion.div {...props}>{props.children}</motion.div>;
}

export function MotionMain(props: HTMLMotionProps<"main">) {
  return <motion.main {...props}>{props.children}</motion.main>;
}

export function MotionSection(props: HTMLMotionProps<"section">) {
  return <motion.section {...props}>{props.children}</motion.section>;
}
