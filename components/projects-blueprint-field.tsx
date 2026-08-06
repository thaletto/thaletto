'use client'

import { FlowField, Grid, Shader } from 'shaders/react'

import { useHiddenShaderField } from '~/components/use-hidden-shader-field'

export function ProjectsBlueprintField({
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
        <FlowField
          strength={0.035}
          detail={1.6}
          speed={0.1}
          evolutionSpeed={0.06}
          seed={31}
          edges="wrap"
        >
          <Grid
            color={ink}
            cellColor="transparent"
            cells={22}
            thickness={0.6}
            softness={0.08}
            variation={0}
            rotation={0}
            colorSpace="oklab"
          />
        </FlowField>
      </Shader>
    </span>
  )
}
