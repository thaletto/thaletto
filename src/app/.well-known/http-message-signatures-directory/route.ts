import jwks from '~/content/web-bot-auth.json'

export function GET() {
  return new Response(JSON.stringify(jwks), {
    headers: {
      'Content-Type': 'application/http-message-signatures-directory+json',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
