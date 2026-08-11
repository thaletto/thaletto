'use client'

import { type ErrorBoundaryProps, ErrorPageView } from './_views/error-page'

export default function EnglishError({ retry }: ErrorBoundaryProps) {
  return <ErrorPageView retry={retry} />
}
