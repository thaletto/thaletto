"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Toggle } from "@/components/ui/toggle"

export function ModeToggle() {
  const { theme = "dark", setTheme } = useTheme()
  const isDark = theme === "dark"
  const [isAnimating, setIsAnimating] = React.useState(false)

  function handleToggle(pressed: boolean) {
    if (isAnimating) return

    setIsAnimating(true)
    setTheme(pressed ? "dark" : "light")

    // Reset animation lock after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)
  }

  return (
    <Toggle
      variant="outline"
      size="default"
      pressed={isDark}
      onPressedChange={handleToggle}
      aria-label="Toggle theme"
      className="relative overflow-hidden group transition-all duration-300 border-1 hover:border-primary/50 focus:border-primary/50"
    >
      {/* Background glow effect */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
          isDark
            ? "bg-gradient-to-r from-background/50 to-background/20 opacity-100"
            : "bg-gradient-to-r from-background/20 to-background/50 opacity-0"
        }`}
      />

      {/* Click ripple effect */}
      <div
        className={`absolute inset-0 bg-white/20 scale-0 rounded-full transition-transform duration-500 ${
          isAnimating ? "animate-ripple" : ""
        }`}
      />

      {/* Moon icon with enhanced transitions */}
      <Moon
        className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-700 ease-out
          dark:rotate-[135deg] dark:scale-0 dark:opacity-0 dark:translate-x-3 dark:-translate-y-3
          rotate-0 scale-100 opacity-100 translate-x-0 translate-y-0 delay-100
          group-hover:text-primary"
      />

      {/* Sun icon with enhanced transitions */}
      <Sun
        className="h-[1.2rem] w-[1.2rem] transition-all duration-700 ease-out
          dark:rotate-0 dark:scale-100 dark:opacity-100 dark:translate-x-0 dark:translate-y-0 dark:delay-100
          -rotate-[135deg] scale-0 opacity-0 translate-x-3 -translate-y-3 delay-0
          group-hover:text-primary"
      />

      {/* Subtle shadow/glow effect */}
      <div
        className={`absolute inset-0 rounded-md transition-all duration-700 ${
          isDark
            ? "shadow-[0_0_8px_2px_rgba(139,92,246,0.3)] opacity-100"
            : "shadow-[0_0_8px_2px_rgba(251,191,36,0.3)] opacity-0"
        }`}
      />
    </Toggle>
  )
}