'use client'

import { useEffect, useState } from 'react'

const taipeiClockTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Taipei',
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const taipeiTimeLabel = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Taipei',
  hour12: true,
  hour: 'numeric',
  minute: '2-digit',
})

function timeParts(date: Date | null) {
  if (!date) return { hour: 0, minute: 0, second: 0, label: '--:-- --' }

  const parts = Object.fromEntries(
    taipeiClockTime
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  )
  const hour = Number(parts.hour)
  const minute = Number(parts.minute)
  const second = Number(parts.second)

  return {
    hour,
    minute,
    second,
    label: taipeiTimeLabel.format(date),
  }
}

export function FooterClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    let timer: number | undefined

    const tick = () => {
      const current = new Date()
      setNow(current)
      timer = window.setTimeout(tick, 1010 - (current.getTime() % 1000))
    }

    const syncVisibility = () => {
      if (timer !== undefined) window.clearTimeout(timer)
      timer = undefined
      if (!document.hidden) tick()
    }

    syncVisibility()
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      document.removeEventListener('visibilitychange', syncVisibility)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [])

  const { hour, minute, second, label } = timeParts(now)
  const secondAngle = second * 6
  const minuteAngle = (minute + second / 60) * 6
  const hourAngle = ((hour % 12) + minute / 60 + second / 3600) * 30

  return (
    <div className="footer-local-time">
      <svg
        className="footer-local-clock"
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        <circle className="footer-clock-ring" cx="16" cy="16" r="14.5" />
        <path
          className="footer-clock-ticks"
          d="M16 3.5v2M28.5 16h-2M16 28.5v-2M3.5 16h2"
        />
        <line
          className="footer-clock-hour"
          x1="16"
          y1="16"
          x2="16"
          y2="9.5"
          transform={`rotate(${hourAngle} 16 16)`}
        />
        <line
          className="footer-clock-minute"
          x1="16"
          y1="16"
          x2="16"
          y2="6.75"
          transform={`rotate(${minuteAngle} 16 16)`}
        />
        <line
          className="footer-clock-second"
          x1="16"
          y1="17.5"
          x2="16"
          y2="5.5"
          transform={`rotate(${secondAngle} 16 16)`}
        />
        <circle className="footer-clock-pin" cx="16" cy="16" r="1" />
      </svg>
      <span className="footer-time-readout">
        <span>UTC+8</span>
        <time
          dateTime={now?.toISOString()}
          aria-label={
            now ? `Current time in Taipei, UTC+8: ${label}` : 'Current time in Taipei, UTC+8'
          }
        >
          {label}
        </time>
      </span>
    </div>
  )
}
