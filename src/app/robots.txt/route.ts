import { contentSignal } from '~/lib/agents/discovery'
import { seo } from '~/lib/metadata/seo'

export function GET() {
  const body = `# ${seo.title} — content and crawler preferences
# https://contentsignals.org/

User-agent: *
Allow: /
Content-Signal: ${contentSignal}
Disallow: /confirm/

Host: ${seo.url.origin}
Sitemap: ${new URL('/sitemap.xml', seo.url).href}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Signal': contentSignal,
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
