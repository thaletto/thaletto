'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { MotionConfig } from 'framer-motion'

type Theme = 'light' | 'system' | 'dark'

type ThemeContextValue = {
  theme: Theme | undefined
  setTheme(value: string): void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function validTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'system' || value === 'dark'
}

function storedTheme(): Theme {
  try {
    const value = localStorage.getItem('theme')
    return validTheme(value) ? value : 'system'
  } catch {
    return 'system'
  }
}

function resolvedTheme(theme: Theme) {
  if (theme !== 'system') return theme
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(theme: Theme, disableTransitions: boolean) {
  const root = document.documentElement
  const resolved = resolvedTheme(theme)
  let transitionBlocker: HTMLStyleElement | undefined

  if (disableTransitions) {
    transitionBlocker = document.createElement('style')
    transitionBlocker.textContent =
      '*,*::before,*::after{transition:none!important}'
    document.head.appendChild(transitionBlocker)
  }

  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved

  if (transitionBlocker) {
    window.getComputedStyle(document.body)
    window.setTimeout(() => transitionBlocker?.remove(), 1)
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setCurrentTheme] = useState<Theme>()

  useEffect(() => {
    const initial = storedTheme()
    setCurrentTheme(initial)
    applyTheme(initial, false)
  }, [])

  useEffect(() => {
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => applyTheme('system', false)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [theme])

  const setTheme = useCallback((value: string) => {
    if (!validTheme(value)) return
    try {
      localStorage.setItem('theme', value)
    } catch {
      // Private browsing may prevent persistence; the in-memory choice remains.
    }
    setCurrentTheme(value)
    applyTheme(value, true)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </MotionConfig>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
