import { GeistPixelCircle, GeistPixelSquare } from 'geist/font/pixel'

import { Barcode } from '~/components/barcode'
import { ErrorHomeAction } from '~/components/error-home-action'
import { T } from '~/lib/i18n'

export function NotFoundPageView() {
  return (
    <div className="error-sheet mx-auto w-full max-w-[37.5rem] px-6">
      <section className="error-proof" aria-labelledby="not-found-title">
        <div className="error-proof-meta" aria-hidden>
          <span>
            <T zh="错误 / 404" en="ERR / 404" />
          </span>
          <span>
            <T zh="油墨 / 00%" en="INK / 00%" />
          </span>
          <span>
            <T zh="位置 / ??" en="POS / ??" />
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
            <T zh="这页走丢了。" en="This page slipped off the grid." />
          </h1>
          <p className="mt-2 max-w-[23rem] text-sm leading-relaxed text-muted-foreground">
            <T
              zh="地址没有坏，只是这里还没有留下印迹。"
              en="The address works. There just isn’t a print here yet."
            />
          </p>
        </div>

        <nav className="error-actions" aria-labelledby="error-recovery-label">
          <span id="error-recovery-label" className="sr-only">
            <T zh="错误恢复" en="Error recovery" />
          </span>
          <ErrorHomeAction />
        </nav>

        <Barcode code="ERR-404-CALI-SO" className="error-barcode" />

        <div className="error-proof-footer font-mono" aria-hidden>
          <span>
            <T zh="来源" en="ORIGIN" />
          </span>
          <span>
            <T zh="无印迹" en="NO IMPRESSION" />
          </span>
          <span>
            <T zh="边缘" en="EDGE" />
          </span>
        </div>
      </section>
    </div>
  )
}
