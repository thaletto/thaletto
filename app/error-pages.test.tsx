// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ErrorPageView } from './_views/error-page'
import { NotFoundPageView } from './_views/not-found-page'
import GlobalError from './global-error'

vi.mock('geist/font/pixel', () => ({
  GeistPixelCircle: { className: 'pixel-circle' },
  GeistPixelSquare: { className: 'pixel-square' },
}))
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'font-geist' }),
  Geist_Mono: () => ({ variable: 'font-geist-mono' }),
}))
vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'font-frex-gb' }),
}))

afterEach(cleanup)

describe('public error recovery', () => {
  it('keeps the not-found proof sheet in English', () => {
    render(<NotFoundPageView />)

    expect(screen.getByText('ERR / 404')).toBeTruthy()
    expect(screen.getByText('This page slipped off the grid.')).toBeTruthy()
    expect(screen.getByText('NO IMPRESSION')).toBeTruthy()
    expect(screen.queryByText('这页走丢了。')).toBeNull()
  })

  it('offers retry and home recovery without exposing an error message', () => {
    const retry = vi.fn()

    render(<ErrorPageView retry={retry} />)

    expect(screen.queryByText('private database error')).toBeNull()
    expect(
      screen
        .getByRole('link', { name: /返回首页|Go home/ })
        .getAttribute('href'),
    ).toBe('/')
    fireEvent.click(screen.getByRole('button', { name: /重试|Try again/ }))
    expect(retry).toHaveBeenCalledOnce()
  })

  it('renders a self-contained global fallback without serializing internals', () => {
    const html = renderToStaticMarkup(
      <GlobalError
        error={new Error('private database error')}
        retry={() => undefined}
      />,
    )

    expect(html).toContain('<html')
    expect(html).toContain('<body')
    expect(html).toContain('This page did not print correctly.')
    expect(html).not.toContain('private database error')
  })
})
