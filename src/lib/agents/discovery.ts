export const contentSignal = 'ai-train=yes, search=yes, ai-input=yes'

export const agentLinks = [
  {
    href: '/.well-known/api-catalog',
    rel: 'api-catalog',
    type: 'application/linkset+json',
  },
  {
    href: '/llms.txt',
    rel: 'describedby',
    type: 'text/plain',
  },
  {
    href: '/llms-full.txt',
    rel: 'service-doc',
    type: 'text/plain',
  },
] as const

export const agentLinkHeader = agentLinks
  .map(({ href, rel, type }) => `<${href}>; rel="${rel}"; type="${type}"`)
  .join(', ')
