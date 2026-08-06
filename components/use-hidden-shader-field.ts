'use client'

import { useCallback, useEffect, useState } from 'react'

const SHADER_READY_TIMEOUT_MS = 2000

function readForegroundInk() {
  return getComputedStyle(document.body).color
}

export function useHiddenShaderField(
  onUnavailable: () => void,
  onReady?: () => void,
) {
  const [ink, setInk] = useState(readForegroundInk)
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => {
    setReady(true)
    onReady?.()
  }, [onReady])

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => setInk(readForegroundInk()))
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (ready) return
    const timer = window.setTimeout(onUnavailable, SHADER_READY_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [onUnavailable, ready])

  return { handleReady, ink, ready }
}
