import { existsSync } from 'node:fs'
import { readFileSync } from 'node:fs'
import path from 'node:path'

import Image from 'next/image'

import { SITE_TIME_ZONE } from '~/lib/date'
import { T } from '~/lib/i18n'

// Plate values are stamped, not written: locale-neutral tabular digits
const stampDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: SITE_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

interface TweetSnapshot {
  id: string
  url: string
  lang?: string
  author: { name: string; handle: string }
  createdAt: string
  text: string
  media?: 'video' | 'photo'
  /** archived like count — the fallback when the live read is unavailable */
  likes?: number
}

function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden className="tweet-card-x">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  )
}

// The author avatar resolves in order: a committed tweet-<id>-avatar.(jpg|png)
// beside the snapshot wins; otherwise the server fetches it once at
// build/revalidate time and inlines it as a data URI. The visitor never
// contacts a third party, and a failed fetch degrades to the initial tile.
async function fetchedAvatar(handle: string): Promise<string | null> {
  if (!/^[A-Za-z0-9_]{1,15}$/.test(handle)) return null
  try {
    const response = await fetch(`https://unavatar.io/x/${handle}?size=96`, {
      cache: 'force-cache',
    })
    if (!response.ok) return null
    const type = response.headers.get('content-type') ?? ''
    if (!type.startsWith('image/')) return null
    const bytes = Buffer.from(await response.arrayBuffer())
    if (bytes.length === 0 || bytes.length > 200_000) return null
    return `data:${type};base64,${bytes.toString('base64')}`
  } catch {
    return null
  }
}

// The like count reads from the public syndication endpoint the same way —
// once per build/revalidate on the server — and falls back to the snapshot's
// archived `likes` field (or hides) when the endpoint is unavailable.
async function fetchedLikes(id: string): Promise<number | null> {
  if (!/^\d{1,25}$/.test(id)) return null
  try {
    const token = ((Number(id) / 1e15) * Math.PI)
      .toString(36)
      .replace(/(0+|\.)/g, '')
    const response = await fetch(
      `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${token}`,
      { cache: 'force-cache' },
    )
    if (!response.ok) return null
    const data = (await response.json()) as { favorite_count?: unknown }
    return typeof data.favorite_count === 'number' ? data.favorite_count : null
  } catch {
    return null
  }
}

// Tweets are archived at port time as ./tweet-<id>.json next to the post
// and rendered fully static — no client embed, no third-party requests.
export async function Tweet({ slug, id }: { slug: string; id: string }) {
  const dir = path.join(process.cwd(), 'content/blog', slug)
  const tweet: TweetSnapshot = JSON.parse(readFileSync(path.join(dir, `tweet-${id}.json`), 'utf8'))
  const avatarFile = ['jpg', 'png'].find((ext) => existsSync(path.join(dir, `tweet-${id}-avatar.${ext}`)))
  const [fetched, likes] = await Promise.all([
    avatarFile ? null : fetchedAvatar(tweet.author.handle),
    fetchedLikes(tweet.id).then((count) => count ?? tweet.likes ?? null),
  ])

  return (
    <a className="tweet-card" href={tweet.url} target="_blank" rel="noreferrer">
      <span className="tweet-card-head">
        {avatarFile ? (
          <Image
            src={`/content/blog/${slug}/tweet-${id}-avatar.${avatarFile}`}
            alt=""
            width={40}
            height={40}
            className="tweet-card-avatar"
          />
        ) : fetched ? (
          // a build-time data URI — next/image has nothing to optimize here
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fetched}
            alt=""
            width={40}
            height={40}
            className="tweet-card-avatar"
          />
        ) : (
          <span className="tweet-card-avatar" aria-hidden>
            {tweet.author.name.charAt(0)}
          </span>
        )}
        <span className="tweet-card-names">
          <span className="tweet-card-name">{tweet.author.name}</span>
          <span className="tweet-card-handle">@{tweet.author.handle}</span>
        </span>
        <XGlyph />
      </span>
      <span className="tweet-card-body" lang={tweet.lang}>
        {tweet.text.split('\n\n').map((paragraph, i) => (
          <span key={i} className="block">
            {paragraph}
          </span>
        ))}
      </span>
      <span className="tweet-card-foot">
        <time dateTime={tweet.createdAt}>
          {stampDateFormat.format(new Date(tweet.createdAt)).replaceAll('-', '.')}
        </time>
        {likes !== null && (
          <span>
            · {likes.toLocaleString('en-US')} <T zh="喜欢" en="Likes" />
          </span>
        )}
        {tweet.media === 'video' && <span><T zh="· 含视频" en="· Contains video" /></span>}
        <span className="tweet-card-mark" aria-hidden>
          ↗
        </span>
      </span>
    </a>
  )
}
