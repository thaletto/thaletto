import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Serves colocated public-content images so content can live next to its MDX
// (ADR-0001) without a public/ copy step.
const ALLOWED =
  /^(?:blog\/[a-z0-9-]+|projects\/[a-z0-9-]+|newsletters\/[0-9]+)\/[A-Za-z0-9_-]+\.(png|jpe?g|webp|gif|avif)$/

const MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const rel = (await params).path.join('/')
  const match = ALLOWED.exec(rel)
  if (!match) return new Response('Not found', { status: 404 })

  try {
    const buf = await readFile(path.join(process.cwd(), 'src/content', rel))
    const ext = match[1]
    return new Response(new Uint8Array(buf), {
      headers: {
        'Content-Type': MIME[ext],
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
