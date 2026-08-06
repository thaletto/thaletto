'use client'

import { RefreshCw } from 'lucide-react'
import { GeistPixelCircle, GeistPixelSquare } from 'geist/font/pixel'

import { Barcode } from '~/components/barcode'
import { ErrorHomeAction } from '~/components/error-home-action'
import { Button } from '~/components/ui/button'
import { T } from '~/lib/i18n'

export interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  retry: () => void
}

export function ErrorPageView({ retry }: Pick<ErrorBoundaryProps, 'retry'>) {
  return (
    <div className="error-sheet mx-auto w-full max-w-[37.5rem] px-6">
      <section className="error-proof" aria-labelledby="error-title">
        <div className="error-proof-meta" aria-hidden>
          <span>
            <T zh="错误 / 500" en="ERR / 500" />
          </span>
          <span>
            <T zh="油墨 / 失准" en="INK / MISREG" />
          </span>
          <span>
            <T zh="位置 / 未知" en="POS / ??" />
          </span>
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
            <T zh="这页没有印好。" en="This page did not print correctly." />
          </h1>
          <p className="mt-2 max-w-[23rem] text-sm leading-relaxed text-muted-foreground">
            <T
              zh="没有任何私人细节被显示。你可以重试，或安全返回首页。"
              en="No private details are shown. Try again, or return home safely."
            />
          </p>
        </div>

        <nav
          className="error-actions flex flex-wrap gap-3"
          aria-labelledby="error-recovery-label"
        >
          <span id="error-recovery-label" className="sr-only">
            <T zh="错误恢复" en="Error recovery" />
          </span>
          <Button size="md" leadingIcon={RefreshCw} onClick={retry}>
            <T zh="重试" en="Try again" />
          </Button>
          <ErrorHomeAction />
        </nav>

        <Barcode code="ERR-500-CALI-SO" className="error-barcode" />

        <div className="error-proof-footer font-mono" aria-hidden>
          <span>
            <T zh="来源" en="ORIGIN" />
          </span>
          <span>
            <T zh="等待重印" en="AWAITING REPRINT" />
          </span>
          <span>
            <T zh="边缘" en="EDGE" />
          </span>
        </div>
      </section>
    </div>
  )
}
