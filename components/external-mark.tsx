import { T } from '~/lib/i18n'

export function ExternalMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="external-mark"
    >
      <path
        d="M4.60578 11.4267L11.394 4.63847M5.70737 4.66825L11.394 4.63847L11.3642 10.3251"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ExternalLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="external-label">
      <span className="external-label-text">{children}</span>
      <ExternalMark />
      <span className="sr-only">
        <T zh="（在新标签页中打开）" en=" (opens in a new tab)" />
      </span>
    </span>
  )
}
