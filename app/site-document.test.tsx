import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fontVariablesForLocale } = vi.hoisted(() => ({
  fontVariablesForLocale: vi.fn((_locale: 'zh' | 'en') => 'latin-font'),
}))

vi.mock('react', async (importOriginal) => {
  const react = await importOriginal<typeof import('react')>()

  return {
    ...react,
    ViewTransition: ({ children }: { children: React.ReactNode }) => children,
  }
})

vi.mock('@vercel/analytics/next', () => ({
  Analytics: () => <span data-vercel-analytics="" />,
}))

vi.mock('~/components/ambient-background', () => ({
  AmbientBackground: () => null,
}))
vi.mock('~/components/dock', () => ({
  Dock: () => <span data-public-dock="" />,
  DockFallback: () => <span data-public-dock-fallback="" />,
}))
vi.mock('~/components/preview-card-timing', () => ({
  PreviewCardTimingProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-public-preview-cards="">{children}</div>
  ),
}))
vi.mock('~/components/site-footer', () => ({
  SiteFooter: () => <span data-public-footer="" />,
}))
vi.mock('~/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))
vi.mock('~/lib/security/inline-scripts', () => ({
  PREPAINT_SCRIPT: '',
}))
vi.mock('~/lib/social-live', () => ({
  getGitHub: vi.fn().mockResolvedValue({}),
  getSocial: vi.fn().mockResolvedValue({}),
}))
vi.mock('~/components/route-motion-controller', () => ({
  RouteMotionController: () => <span data-public-route-motion="" />,
  RouteViewTransition: ({ children }: { children: React.ReactNode }) => (
    <div data-public-route-transition="">{children}</div>
  ),
}))
vi.mock('./fonts', () => ({
  fontVariablesForLocale,
}))

import { SiteDocument } from './_components/site-document'
import { getGitHub, getSocial } from '~/lib/social-live'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('SiteDocument', () => {
  it('always renders the English document with the latin font', async () => {
    const english = renderToStaticMarkup(
      await SiteDocument({ children: <p>English page</p>, locale: 'en' }),
    )

    expect(english).toContain('latin-font')
    expect(english).not.toContain('cjk-font')
    expect(english).toContain('lang="en"')
    expect(fontVariablesForLocale).toHaveBeenCalledWith('en')
  })

  it('collects page views across the public route families', async () => {
    const html = renderToStaticMarkup(
      await SiteDocument({
        children: <p>Public page</p>,
        locale: 'en',
      }),
    )

    expect(html).toContain('data-vercel-analytics')
    expect(html).toContain('data-public-dock')
    expect(html).toContain('data-public-footer')
    expect(html).toContain('data-public-route-transition')
    expect(html).toContain('data-public-preview-cards')
  })

  it('reads the live social numbers for the shared footer', async () => {
    await SiteDocument({ children: <p>Public page</p>, locale: 'en' })

    expect(getSocial).toHaveBeenCalledOnce()
    expect(getGitHub).toHaveBeenCalledOnce()
  })
})
