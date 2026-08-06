// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DockFallback } from './dock'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}))
afterEach(cleanup)

describe('DockFallback', () => {
  it('keeps the dock shell useful while route state resolves', () => {
    render(<DockFallback locale="en" />)

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    })
    expect(navigation.getAttribute('aria-busy')).toBe('true')
    expect(navigation.style.viewTransitionName).toBe('site-dock')
    expect(screen.getByRole('link', { name: /Home/ }).getAttribute('href')).toBe(
      '/',
    )
    expect(
      screen.getByRole('link', { name: /Writing/ }).getAttribute('href'),
    ).toBe('/blog')
    expect(
      screen.getByRole('link', { name: /Projects/ }).getAttribute('href'),
    ).toBe('/projects')
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })
})
