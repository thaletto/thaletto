/** @vitest-environment jsdom */

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { TimeAllocationChart } from './time-allocation-chart'

afterEach(cleanup)

describe('TimeAllocationChart', () => {
  it('renders the English takeaway, values, and estimate caveat', () => {
    const { container } = render(<TimeAllocationChart locale="en" />)
    const chart = screen.getByRole('group', {
      name: 'Baby tracking app development time allocation',
    })

    expect(
      within(chart).getByText('95% of the time went into judgment and refinement'),
    ).toBeTruthy()
    expect(within(chart).getByText('Upfront planning')).toBeTruthy()
    expect(
      within(chart).getByText('Decisions, UX, and refinement'),
    ).toBeTruthy()
    expect(
      within(chart).getByText('UI debugging and prototyping'),
    ).toBeTruthy()
    expect(
      screen.getByText(/Business logic was not the main bottleneck/),
    ).toBeTruthy()
    expect(
      container
        .querySelector('[data-tone="context"]')
        ?.getAttribute('style'),
    ).toContain('--allocation: 5%')
    expect(
      container
        .querySelector('[data-tone="primary"]')
        ?.getAttribute('style'),
    ).toContain('--allocation: 50%')
    expect(
      container
        .querySelector('[data-tone="secondary"]')
        ?.getAttribute('style'),
    ).toContain('--allocation: 45%')
  })

  it('renders the English edition regardless of the requested locale', () => {
    render(<TimeAllocationChart locale="zh" />)

    expect(
      screen.getByRole('group', {
        name: 'Baby tracking app development time allocation',
      }),
    ).toBeTruthy()
    expect(
      screen.getByText('95% of the time went into judgment and refinement'),
    ).toBeTruthy()
    expect(screen.getByText('Decisions, UX, and refinement')).toBeTruthy()
  })
})
