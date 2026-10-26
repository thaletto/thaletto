import { agentLinkHeader, contentSignal } from '~/lib/agents/discovery'
import { absoluteUrl } from '~/lib/agents/urls'

export function GET() {
  const catalog = {
    linkset: [
      {
        anchor: absoluteUrl('/'),
        'service-doc': [{ href: absoluteUrl('/llms-full.txt'), type: 'text/plain' }],
        'service-desc': [{ href: absoluteUrl('/sitemap.xml'), type: 'application/xml' }],
        describedby: [{ href: absoluteUrl('/llms.txt'), type: 'text/plain' }],
      },
    ],
  }

  return new Response(JSON.stringify(catalog, null, 2), {
    headers: {
      'Content-Type': 'application/linkset+json; charset=utf-8',
      'Content-Signal': contentSignal,
      Link: agentLinkHeader,
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
