import { NextResponse, type NextRequest } from 'next/server'

import { prefersMarkdown } from '~/lib/agents/negotiation'

export default function proxy(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return NextResponse.next()
  if (!prefersMarkdown(request.headers.get('accept'))) return NextResponse.next()

  const url = request.nextUrl.clone()
  const headers = new Headers(request.headers)
  headers.set('x-agent-markdown-path', request.nextUrl.pathname)
  url.pathname = '/api/agent-markdown'
  url.search = ''

  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  matcher: [
    '/((?!_next/|api/|content/|\\.well-known/|opengraph-image|robots\\.txt|sitemap\\.xml|llms\\.txt|llms-full\\.txt|.*\\.[^/]+$).*)',
  ],
}
