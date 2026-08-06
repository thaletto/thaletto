import { describe, expect, it } from 'vitest'

import { faviconTone, isSameOriginFaviconSource } from './favicon-tone'

// 4×4 RGBA buffer where `coverage` of the pixels carry the given color at
// full alpha and the rest stay transparent.
function icon(rgb: [number, number, number], coverage: number, alpha = 255) {
  const pixels = 16
  const data = new Uint8ClampedArray(pixels * 4)
  const filled = Math.round(pixels * coverage)
  for (let i = 0; i < filled; i++) {
    data.set([...rgb, alpha], i * 4)
  }
  return { data, pixels }
}

// glyph that is mostly `rgb` with a smaller region of `accent` color
function accentedIcon(
  rgb: [number, number, number],
  accent: [number, number, number],
  coverage: number,
  accentShare: number,
) {
  const { data, pixels } = icon(rgb, coverage)
  const filled = Math.round(pixels * coverage)
  for (let i = 0; i < Math.round(filled * accentShare); i++) {
    data.set([...accent, 255], i * 4)
  }
  return { data, pixels }
}

describe('faviconTone', () => {
  it('flags a grayscale white glyph on transparency as invertible', () => {
    const { data, pixels } = icon([255, 255, 255], 0.4)
    expect(faviconTone(data, pixels)).toBe('light-mono')
  })

  it('flags a grayscale black glyph on transparency as invertible', () => {
    const { data, pixels } = icon([0, 0, 0], 0.4)
    expect(faviconTone(data, pixels)).toBe('dark-mono')
  })

  it('keeps the chip for dark glyphs carrying brand color', () => {
    // Astro-like: mostly black flame with a red gradient region
    const { data, pixels } = accentedIcon([0, 0, 0], [230, 40, 80], 0.4, 0.2)
    expect(faviconTone(data, pixels)).toBe('dark')
  })

  it('keeps the chip for light glyphs carrying brand color', () => {
    const { data, pixels } = accentedIcon([255, 255, 255], [255, 200, 60], 0.4, 0.2)
    expect(faviconTone(data, pixels)).toBe('light')
  })

  it('flags an opaque near-white tile as flat', () => {
    const { data, pixels } = icon([250, 250, 250], 1)
    expect(faviconTone(data, pixels)).toBe('flat')
  })

  it('leaves colorful or mid-tone icons alone', () => {
    const orange = icon([230, 126, 34], 0.5)
    expect(faviconTone(orange.data, orange.pixels)).toBeUndefined()

    const opaqueDark = icon([20, 20, 20], 1)
    expect(faviconTone(opaqueDark.data, opaqueDark.pixels)).toBeUndefined()
  })

  it('ignores fully transparent icons', () => {
    const { data, pixels } = icon([255, 255, 255], 0)
    expect(faviconTone(data, pixels)).toBeUndefined()
  })

  it('samples same-origin media without touching cross-origin fallbacks', () => {
    const pageUrl = 'https://cali.so/ama'

    expect(
      isSameOriginFaviconSource(
        '/link-media/favicon?url=https%3A%2F%2Flinear.app',
        pageUrl,
      ),
    ).toBe(true)
    expect(
      isSameOriginFaviconSource(
        'https://og.zolplay.com/favicon?url=https%3A%2F%2Fcursor.com',
        pageUrl,
      ),
    ).toBe(false)
  })
})
