import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { isPublishedPostSlug } from './lib/public-content-routes'

function missingPublicContent(pathname: string) {
  const postMatch = pathname.match(/^\/(?:en\/)?blog\/([^/]+)\/?$/)
  if (postMatch) {
    const slug = postMatch[1]
    if (/^(?:opengraph-image|twitter-image)-/.test(slug)) return false
    return !isPublishedPostSlug(slug)
  }

  return false
}

export function siteProxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (missingPublicContent(pathname)) {
    const notFoundUrl = request.nextUrl.clone()
    notFoundUrl.pathname = '/_not-found'
    return NextResponse.rewrite(notFoundUrl, { status: 404 })
  }

  return NextResponse.next()
}

export function proxy(request: NextRequest, _event: NextFetchEvent) {
  return siteProxy(request)
}

export const config = {
  matcher: ['/blog/:slug', '/en/blog/:slug'],
}
