import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'

import { siteIdentity, siteSocial } from '~/lib/content/personal'

export const alt = `${siteIdentity.name} — ${siteIdentity.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const ink = '#121212'
const mutedInk = '#777777'
const guide = '#d9d9d6'
const accent = '#e96718'
const paper = '#fdfdfc'
const pixels = [
  { id: 'top-left', color: '#b8b8b4' },
  { id: 'top-center', color: '#dededb' },
  { id: 'top-right', color: accent },
  { id: 'middle-left', color: '#b8b8b4' },
  { id: 'middle-center', color: '#dededb' },
  { id: 'middle-right', color: '#dededb' },
  { id: 'bottom-left', color: '#b8b8b4' },
  { id: 'bottom-center', color: '#dededb' },
  { id: 'bottom-right', color: '#dededb' },
] as const

function PixelCluster() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 58,
        right: 68,
        width: 28,
        height: 28,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
      }}
    >
      {pixels.map((pixel) => (
        <div
          key={pixel.id}
          style={{
            width: 6,
            height: 6,
            backgroundColor: pixel.color,
          }}
        />
      ))}
    </div>
  )
}

export default async function OpenGraphImage() {
  const portrait = await readFile(path.join(process.cwd(), 'public/images/avatar.png'))
  const portraitDataUri = `data:image/png;base64,${portrait.toString('base64')}`
  const profileLine = `${siteSocial.x.bio?.replace(/,\s*/g, '. ') ?? siteIdentity.role}.`

  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        color: ink,
        backgroundColor: paper,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 48,
          bottom: 40,
          left: 48,
          display: 'flex',
          border: `1px dashed ${guide}`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 210,
          width: 590,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 70,
            fontWeight: 700,
            letterSpacing: '-0.045em',
            lineHeight: 1,
          }}
        >
          {siteIdentity.name}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 50,
            maxWidth: 610,
            color: mutedInk,
            fontSize: 34,
            fontWeight: 400,
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
          }}
        >
          {profileLine}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 190,
          right: 100,
          width: 242,
          height: 258,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 10,
          paddingRight: 10,
          paddingBottom: 26,
          paddingLeft: 10,
          backgroundColor: '#f7f6f2',
          border: '1px solid #ecebe7',
          transform: 'rotate(1.5deg)',
        }}
      >
        {/* Satori needs an embedded URL for local files. The source remains the checked-in portrait. */}
        {/* biome-ignore lint/performance/noImgElement: Satori ImageResponse requires a plain embedded image */}
        <img
          src={portraitDataUri}
          alt=""
          width={220}
          height={220}
          style={{
            width: 220,
            height: 220,
            objectFit: 'cover',
          }}
        />
      </div>

      <PixelCluster />
    </div>,
    size,
  )
}
