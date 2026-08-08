import { GeistPixelCircle, GeistPixelSquare } from 'geist/font/pixel'

import { Barcode } from '~/components/barcode'
import { ErrorHomeAction } from '~/components/error-home-action'

export function NotFoundPageView() {
  return (
    <div className="error-sheet mx-auto w-full max-w-[37.5rem] px-6">
      <section className="error-proof" aria-labelledby="not-found-title">
        <div className="error-proof-meta" aria-hidden>
          <span>
            ERR / 404
          </span>
          <span>
            INK / 00%
          </span>
          <span>
            POS / ??
          </span>
        </div>

        <div className="error-registration" aria-hidden>
          <span />
        </div>

        <div className="error-code" aria-hidden>
          <span className={GeistPixelSquare.className}>4</span>
          <span className={GeistPixelCircle.className}>0</span>
          <span className={GeistPixelSquare.className}>4</span>
        </div>

        <span className="error-loose-pixel error-loose-pixel-a" aria-hidden />
        <span className="error-loose-pixel error-loose-pixel-b" aria-hidden />
        <span className="error-loose-pixel error-loose-pixel-c" aria-hidden />

        <div className="error-message">
          <h1 id="not-found-title" className="text-sm font-semibold">
            This page slipped off the grid.
          </h1>
          <p className="mt-2 max-w-[23rem] text-sm leading-relaxed text-muted-foreground">
            The address works. There just isn’t a print here yet.
          </p>
        </div>

        <nav className="error-actions" aria-labelledby="error-recovery-label">
          <span id="error-recovery-label" className="sr-only">
            Error recovery
          </span>
          <ErrorHomeAction />
        </nav>

        <Barcode code="ERR-404-CALI-SO" className="error-barcode" />

        <div className="error-proof-footer font-mono" aria-hidden>
          <span>
            ORIGIN
          </span>
          <span>
            NO IMPRESSION
          </span>
          <span>
            EDGE
          </span>
        </div>
      </section>
    </div>
  )
}
