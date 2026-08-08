// Surface ladder context: carries the current substrate depth (1–8 → 8).
// `Elevated` and friends read it to step cards/menus/dialogs up a level, then
// re-provide the increased step so nesting walks the ladder automatically.
'use client'

import { createContext, type ReactNode, useContext } from 'react'

const SurfaceContext = createContext<number>(1)

export function useSurface(): number {
  return useContext(SurfaceContext)
}

export function SurfaceProvider({ value, children }: { value: number; children: ReactNode }) {
  return (
    <SurfaceContext.Provider value={Math.max(1, Math.min(8, value))}>
      {children}
    </SurfaceContext.Provider>
  )
}
