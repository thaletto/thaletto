import { PeleError, render } from 'pele'

import { ScrollAreaX } from '~/components/ui/scroll-area'

// Article column: max-w-173 (692px) minus px-4, so diagrams lay out against that measure.
const COLUMN_WIDTH = 660

// Stable per-diagram prefix so ids never collide when two diagrams share node names.
function diagramId(source: string) {
  let hash = 0
  for (let i = 0; i < source.length; i++) hash = (hash * 31 + source.charCodeAt(i)) | 0
  return `d${(hash >>> 0).toString(36)}`
}

export function MermaidDiagram({ code, caption }: { code: string; caption?: string }) {
  let svg: string
  try {
    svg = render(code, { padding: 24, maxWidth: COLUMN_WIDTH, idPrefix: diagramId(code) }).svg
  } catch (error) {
    if (!(error instanceof PeleError)) throw error

    const position = error.line ? ` at line ${error.line}, column ${error.column}` : ''
    throw new Error(`mermaid ${error.code}${position}: ${error.message}\n${error.snippet}\n${code}`)
  }

  // Trusted input: repo-committed MDX rendered at build time, never runtime strings.
  const sheet = (
    <div className="mermaid-frame">
      <ScrollAreaX>
        <div
          className="mermaid-sheet"
          role="img"
          aria-label={caption ?? 'Diagram'}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </ScrollAreaX>
    </div>
  )
  if (!caption) return <figure className="mermaid-figure">{sheet}</figure>
  return (
    <figure className="post-figure mermaid-figure">
      {sheet}
      <figcaption className="post-figcaption">{caption}</figcaption>
    </figure>
  )
}
