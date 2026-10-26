import Link from 'next/link'

import { WayfindingArrow } from '~/components/blog/post-toc'

// Inline because LightningCSS strips backdrop-filter from stylesheets.
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
      <span className="floating-back-icon" aria-hidden>
        <WayfindingArrow direction="back" />
      </span>
    </Link>
  )
}
