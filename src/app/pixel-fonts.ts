import localFont from 'next/font/local'

// Error pages only. `geist/font/pixel` declares all five faces with preload on,
// which put ~130 KB of font preloads on every page via the root error boundary.

export const GeistPixelSquare = localFont({
  src: '../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Square.woff2',
  weight: '500',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
  adjustFontFallback: false,
  preload: false,
})

export const GeistPixelCircle = localFont({
  src: '../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Circle.woff2',
  weight: '500',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
  adjustFontFallback: false,
  preload: false,
})
