'use client'

import { useCallback, useRef } from 'react'

type WebGpuNavigator = Navigator & {
  gpu?: {
    requestAdapter: () => Promise<unknown | null>
  }
}

export function useWebGpuCapability() {
  const supported = useRef<boolean | null>(null)
  const request = useRef<Promise<boolean> | null>(null)

  const check = useCallback(() => {
    if (supported.current !== null) return Promise.resolve(supported.current)

    if (request.current === null) {
      const gpu = (navigator as WebGpuNavigator).gpu
      request.current = (async () => {
        if (!gpu?.requestAdapter) return false
        try {
          return Boolean(await gpu.requestAdapter())
        } catch {
          return false
        }
      })().then((available) => {
        supported.current = available
        return available
      })
    }

    return request.current
  }, [])

  const markUnavailable = useCallback(() => {
    supported.current = false
  }, [])

  return { check, markUnavailable, supported }
}
