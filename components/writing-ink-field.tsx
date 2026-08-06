'use client'

import { useMemo } from 'react'
import { Shader, Strands } from 'shaders/react'

import { useHiddenShaderField } from '~/components/use-hidden-shader-field'

const STRANDS_START = { x: 0, y: 0.5 }
const STRANDS_END = { x: 1, y: 0.5 }

export function WritingInkField({
  onUnavailable,
  onReady,
}: {
  onUnavailable: () => void
  onReady: () => void
}) {
  const { handleReady, ink, ready } = useHiddenShaderField(
    onUnavailable,
    onReady,
  )
  const stops = useMemo(
    () => [
      { color: ink, position: 0 },
      { color: ink, position: 0.5 },
      { color: ink, position: 1 },
    ],
    [ink],
  )

  return (
    <span
      className="hidden-list-shader-shell"
      data-ready={ready ? 'true' : 'false'}
    >
      <Shader
        className="hidden-list-shader-canvas"
        colorSpace="srgb"
        disableTelemetry
        onReady={handleReady}
      >
        <Strands
          speed={0.72}
          amplitude={0.7}
          frequency={1.4}
          lineCount={4}
          lineWidth={0.05}
          softness={0.04}
          spread={0.2}
          pinEdges
          stops={stops}
          colorSpace="oklab"
          colorScale={1}
          colorVariance={0}
          colorSpeed={0}
          start={STRANDS_START}
          end={STRANDS_END}
        />
      </Shader>
    </span>
  )
}
