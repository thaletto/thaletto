import type { CSSProperties } from 'react'

const ALLOCATION = [
  {
    value: 5,
    tone: 'context',
    label: 'Upfront planning',
  },
  {
    value: 50,
    tone: 'primary',
    label: 'Decisions, UX, and refinement',
  },
  {
    value: 45,
    tone: 'secondary',
    label: 'UI debugging and prototyping',
  },
] as const

export function TimeAllocationChart() {
  const title = '95% of the time went into judgment and refinement'
  const caption =
    'Business logic was not the main bottleneck. Personal retrospective estimate, not tracked hours.'

  return (
    <figure className="post-figure time-allocation-figure">
      <div
        className="time-allocation-chart"
        role="group"
        aria-label="Baby tracking app development time allocation"
      >
        <div className="time-allocation-chart__header">
          <p className="time-allocation-chart__eyebrow">
            Baby tracking app · Time allocation
          </p>
          <p className="time-allocation-chart__title">{title}</p>
        </div>

        <div className="time-allocation-chart__rows">
          {ALLOCATION.map((item) => (
            <div className="time-allocation-chart__row" key={item.tone}>
              <div className="time-allocation-chart__label">
                <span>{item.label}</span>
                <span className="time-allocation-chart__value">{item.value}%</span>
              </div>
              <div className="time-allocation-chart__track" aria-hidden="true">
                <span
                  className="time-allocation-chart__bar"
                  data-tone={item.tone}
                  style={{ '--allocation': `${item.value}%` } as CSSProperties}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="post-figcaption">{caption}</figcaption>
    </figure>
  )
}