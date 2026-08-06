// Rebuilds content/link-previews.json through og.zolplay.com for the external
// links found in both localized post sources. Run manually when posts change:
//   node scripts/refresh-link-previews.mjs
// Requires network access; existing entries are kept when a fetch fails.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { normalizeOgMetadata, ogZolplayUrl } from '../lib/og-zolplay.mjs'

const POSTS_DIR = 'content/blog'
const CACHE = 'content/link-previews.json'
const MAX_METADATA_BYTES = 64 * 1024
const POST_FILES = ['index.mdx', 'index.en.mdx']
const MARKDOWN_LINK = /\]\((https?:\/\/(?:[^()\s]|\([^()\s]*\))+)\)/g
const MDX_LINK = /href="(https?:\/\/[^"]+)"/g

const urls = new Set()
for (const dir of readdirSync(POSTS_DIR, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue

  for (const file of POST_FILES) {
    const source = path.join(POSTS_DIR, dir.name, file)
    if (!existsSync(source)) continue

    const mdx = readFileSync(source, 'utf8')
    for (const [, href] of mdx.matchAll(MARKDOWN_LINK)) urls.add(href)
    for (const [, href] of mdx.matchAll(MDX_LINK)) urls.add(href)
  }
}

const cache = JSON.parse(readFileSync(CACHE, 'utf8'))

for (const url of urls) {
  try {
    const metadataUrl = ogZolplayUrl('metadata', url)
    if (!metadataUrl) throw new Error('invalid public HTTP(S) target')

    const res = await fetch(metadataUrl, {
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; cali.so link previews)' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const body = await res.text()
    if (Buffer.byteLength(body, 'utf8') > MAX_METADATA_BYTES) {
      throw new Error('metadata response exceeds 64 KiB')
    }

    const preview = normalizeOgMetadata(url, JSON.parse(body), cache[url])
    if (!preview) throw new Error('invalid metadata response')

    cache[url] = preview
    console.log('ok', url)
  } catch (err) {
    if (!cache[url]) cache[url] = { domain: new URL(url).hostname }
    console.warn('skip', url, String(err.message ?? err))
  }
}

writeFileSync(CACHE, JSON.stringify(cache, null, 2) + '\n')
console.log(`${Object.keys(cache).length} entries -> ${CACHE}`)
