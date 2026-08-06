'use client'

import { ContourLines, PerlinNoise, Shader } from 'shaders/react'

import { useHiddenShaderField } from '~/components/use-hidden-shader-field'

export function PortraitShaderField({ onUnavailable }: { onUnavailable: () => void }) {
  const { handleReady, ink, ready } = useHiddenShaderField(onUnavailable)

  return (
    <span className="portrait-hidden-stage-shader-shell" data-ready={ready ? 'true' : 'false'}>
      <Shader
        className="portrait-hidden-stage-canvas"
        colorSpace="srgb"
        disableTelemetry
        onReady={handleReady}
      >
        <ContourLines
          levels={5}
          lineWidth={0.7}
          softness={0.1}
          gamma={0.72}
          colorMode="custom"
          lineColor={ink}
          backgroundColor="transparent"
        >
          <PerlinNoise
            colorA="#ffffff"
            colorB="#000000"
            colorSpace="oklch"
            scale={2.7}
            contrast={0.08}
            balance={-0.06}
            seed={19}
            speed={0.06}
          />
        </ContourLines>
      </Shader>
    </span>
  )
}
