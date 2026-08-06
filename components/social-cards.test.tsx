// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import social from '~/content/social.json'

import { XCardBody } from './social-cards'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}))

afterEach(cleanup)

describe('X hover card', () => {
  it('renders the current profile description and both relationship counts', () => {
    const { container } = render(<XCardBody data={social.x} />)

    expect(container.textContent).toContain(
      'a dad. an agent orchestrator. a design engineer. a @raycast ambassador.',
    )
    expect(container.textContent).toContain(
      'creative director & founder at @zolplay.',
    )
    expect(container.textContent).not.toContain('爸爸、Agent 指挥官')
    expect(container.textContent).toContain(social.x.followers)
    expect(container.textContent).toContain(social.x.following)
    expect(container.textContent).toContain('followers')
    expect(container.textContent).toContain('following')
  })
})
