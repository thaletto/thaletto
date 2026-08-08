'use client'

import { GeistPixelCircle, GeistPixelSquare } from 'geist/font/pixel'
import { RefreshCw } from 'lucide-react'
import { ErrorHomeAction } from '~/components/home/error-home-action'
import { Button } from '~/components/ui/button'
import { Barcode } from '~/components/visual/barcode'

export interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  retry: () => void
}

export function ErrorPageView({ retry }: Pick<ErrorBoundaryProps, 'retry'>) {
  return (
    <div className="error-sheet mx-auto w-full max-w-[37.5rem] px-6">
      <section className="error-proof" aria-labelledby="error-title">
        <div className="error-proof-meta" aria-hidden>
          <span>ERR / 500</span>
          <span>INK / MISREG</span>
          <span>POS / ??</span>
        </div>

        <div className="error-registration" aria-hidden>
          <span />
        </div>

        <div className="error-code" aria-hidden>
          <span className={GeistPixelSquare.className}>5</span>
          <span className={GeistPixelCircle.className}>0</span>
          <span className={GeistPixelSquare.className}>0</span>
        </div>

        <span className="error-loose-pixel error-loose-pixel-a" aria-hidden />
        <span className="error-loose-pixel error-loose-pixel-b" aria-hidden />
        <span className="error-loose-pixel error-loose-pixel-c" aria-hidden />

        <div className="error-message">
          <h1 id="error-title" className="text-sm font-semibold">
            This page did not print correctly.
          </h1>
          <p className="mt-2 max-w-[23rem] text-sm leading-relaxed text-muted-foreground">
            No private details are shown. Try again, or return home safely.
          </p>
        </div>

        <nav className="error-actions flex flex-wrap gap-3" aria-labelledby="error-recovery-label">
          <span id="error-recovery-label" className="sr-only">
            Error recovery
          </span>
          <Button size="md" leadingIcon={RefreshCw} onClick={retry}>
            Try again
          </Button>
          <ErrorHomeAction />
        </nav>

        <Barcode code="ERR-500-THALETTO-SO" className="error-barcode" />

        <div className="error-proof-footer font-mono" aria-hidden>
          <span>ORIGIN</span>
          <span>AWAITING REPRINT</span>
          <span>EDGE</span>
        </div>
      </section>
    </div>
  )
}
