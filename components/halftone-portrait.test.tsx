// @vitest-environment jsdom

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { HalftonePortrait } from './halftone-portrait'

const navigation = vi.hoisted(() => ({ pathname: '/' }))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
}))

describe('HalftonePortrait', () => {
  it('keeps the server-rendered portrait visually empty', () => {
    navigation.pathname = '/'
    const container = document.createElement('div')
    container.innerHTML = renderToStaticMarkup(
      <HalftonePortrait
        srcLight="/light.jpg"
        srcDark="/dark.jpg"
        alt="肖像"
        altEn="Portrait"
      />,
    )

    const shell = container.querySelector('[data-halftone]')
    const sources = container.querySelectorAll('img')

    expect(shell?.hasAttribute('data-ready')).toBe(false)
    expect(sources).toHaveLength(2)
    expect(Array.from(sources).every((source) => source.hidden)).toBe(true)
    expect(container.querySelector('canvas')?.getAttribute('aria-label')).toBe('Portrait')
  })
})
