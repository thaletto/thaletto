// A favicon drawn as a white glyph on transparency vanishes on the light
// theme, and its black twin vanishes in dark mode. Known favicons are proxied
// same-origin (/link-media), so their pixels are readable. Cross-origin
// fallback icons stay untagged because reading them would taint the canvas.

const SAMPLE_SIZE = 16

export function isSameOriginFaviconSource(src: string, pageUrl: string) {
  try {
    const page = new URL(pageUrl)
    return new URL(src, page).origin === page.origin
  } catch {
    return false
  }
}

export type FaviconTone = 'light' | 'light-mono' | 'dark' | 'dark-mono' | 'flat'

// Alpha-weighted mean luminance over an RGBA buffer. Translucent glyphs
// that would vanish into a theme background split by whether they carry
// brand color: `*-mono` grayscale marks can simply invert to the theme's
// ink, while colored ones (`light`/`dark`) need a contrast chip — an
// inverted brand color would be a wrong color. `flat` marks an opaque
// near-white tile that only needs an edge to stop bleeding into the
// light page.
export function faviconTone(
  data: Uint8ClampedArray,
  pixels: number,
): FaviconTone | undefined {
  let luminance = 0
  let weight = 0
  let colored = 0

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255
    if (!alpha) continue
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
    luminance += ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * alpha
    weight += alpha
    if (Math.max(r, g, b) - Math.min(r, g, b) > 40) colored += alpha
  }

  if (!weight) return undefined
  const mean = luminance / weight
  const coverage = weight / pixels
  const mono = colored / weight < 0.05

  if (coverage > 0.9) return mean > 0.86 ? 'flat' : undefined
  if (mean > 0.8) return mono ? 'light-mono' : 'light'
  if (mean < 0.22) return mono ? 'dark-mono' : 'dark'
  return undefined
}

// Scheme-aware SVG favicons repaint themselves when the theme flips (the
// .dark class toggle and the browser scheme change together), so a tone
// sampled in one theme can describe the wrong pixels in the other.
// Resample every visible favicon after the theme class changes.
let observingTheme = false

function observeThemeChanges() {
  if (observingTheme || typeof MutationObserver === 'undefined') return
  observingTheme = true

  new MutationObserver(() => {
    // double rAF: give the repainted SVG a frame to raster before sampling
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const icons = document.querySelectorAll<HTMLImageElement>(
          '.external-link img, .link-card-site img',
        )
        for (const img of icons) {
          delete img.dataset.tone
          classifyFaviconTone(img)
        }
      }),
    )
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
}

export function classifyFaviconTone(img: HTMLImageElement) {
  const view = img.ownerDocument.defaultView
  if (
    !view ||
    !isSameOriginFaviconSource(img.currentSrc || img.src, view.location.href)
  ) {
    return
  }

  observeThemeChanges()
  if (img.dataset.tone || !img.naturalWidth) return

  try {
    const canvas = document.createElement('canvas')
    canvas.width = SAMPLE_SIZE
    canvas.height = SAMPLE_SIZE
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return

    context.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE)
    const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE)
    const tone = faviconTone(data, SAMPLE_SIZE * SAMPLE_SIZE)
    if (tone) img.dataset.tone = tone
  } catch {
    // a cross-origin fallback icon taints the canvas; leave it untagged
  }
}
