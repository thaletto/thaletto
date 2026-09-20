'use client'

import { MotionConfig } from 'framer-motion'
import { useEffect } from 'react'

// The theme is fixed to the system preference: no stored override, no UI.
// Applies the resolved theme and follows OS changes; MotionConfig keeps the
// reduced-motion contract for JS-driven Motion components.
function applySystemTheme() {
  const resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applySystemTheme()
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', applySystemTheme)
    return () => media.removeEventListener('change', applySystemTheme)
  }, [])

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
