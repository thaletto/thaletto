'use client'

import { useRef, useState } from 'react'

export function PostVideo({
  slug,
  src,
  title,
  kind,
  controls = false,
  loop = false,
}: {
  slug: string
  src: string
  title?: string
  kind: 'blog' | 'projects'
  controls?: boolean
  loop?: boolean
}) {
  const match = src.match(/^\.\/([A-Za-z0-9_.-]+)#(\d+)x(\d+)$/)
  if (!match) throw new Error(`post video needs ./file#WxH format, got: ${src}`)
  const [, file, width, height] = match
  const poster = `/content/${kind}/${slug}/${file.replace(/\.[a-z0-9]+$/i, '-poster.jpg')}`
  const ref = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)
  return (
    <span className="post-figure block">
      <span className="relative block">
        <video
          ref={ref}
          autoPlay
          className="h-auto w-full rounded-xl"
          controls={controls}
          height={+height}
          loop={loop}
          playsInline
          poster={poster}
          preload="metadata"
          src={`/content/${kind}/${slug}/${file}`}
          width={+width}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => setPaused(true))
          }}
          onEnded={() => setPaused(true)}
          onPause={() => setPaused(true)}
          onPlay={() => setPaused(false)}
        />
        {paused ? (
          <button
            aria-label="Replay video"
            className="absolute inset-0 m-auto flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
            onClick={() => void ref.current?.play()}
            type="button"
          >
            <svg fill="currentColor" height="28" viewBox="0 0 24 24" width="28">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        ) : null}
      </span>
      {title ? <span className="post-figcaption block">{title}</span> : null}
    </span>
  )
}
