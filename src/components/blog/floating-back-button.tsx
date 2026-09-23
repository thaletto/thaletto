import Link from 'next/link'

// Floating back button for mobile MDX pages (`/blog/[slug]`,
// `/projects/[slug]`). Mobile-only: the desktop rail already carries a Home
// utility, and the phone island hides it (`utilities-top: display none`).
//
// Styling follows the removed pill dock (`23a5e3c^:dock.tsx`): a frosted
// circular button over a 68% background. The backdrop-filter stays inline —
// LightningCSS strips raw backdrop-filter declarations from stylesheets.
const BACK_GLASS_STYLE = {
  backdropFilter: 'blur(12px) saturate(1.25)',
  WebkitBackdropFilter: 'blur(12px) saturate(1.25)',
} as React.CSSProperties

export function FloatingBackButton({
  href = '/',
  label = 'Back to home',
}: {
  href?: string
  label?: string
}) {
  return (
    <Link href={href} className="floating-back" aria-label={label}>
      <span className="floating-back-glass" aria-hidden style={BACK_GLASS_STYLE} />
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        aria-hidden="true"
        className="floating-back-icon"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11.25 3.75 6.75 9l4.5 5.25" />
        </g>
      </svg>
    </Link>
  )
}
