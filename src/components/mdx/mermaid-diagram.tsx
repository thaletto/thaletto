import { renderMermaidSVG } from 'beautiful-mermaid'

import { ScrollAreaX } from '~/components/ui/scroll-area'

// beautiful-mermaid inlines Google Fonts @imports; strip them so the site stacks apply.
const FONT_IMPORTS = /^\s*@import url\('https:\/\/fonts\.googleapis\.com[^']*'\);\n?/gm

export function MermaidDiagram({ code, caption }: { code: string; caption?: string }) {
  let svg: string
  try {
    svg = renderMermaidSVG(code, {
      bg: 'var(--surface-1)',
      fg: 'var(--foreground)',
      muted: 'var(--muted-foreground)',
      accent: 'var(--gray-9)',
      transparent: true,
      padding: 24,
    })
  } catch (error) {
    throw new Error(
      `mermaid diagram failed to render: ${error instanceof Error ? error.message : String(error)}\n${code}`,
    )
  }

  // Trusted input: repo-committed MDX rendered at build time, never runtime strings.
  const sheet = (
    <div className="mermaid-frame">
      <ScrollAreaX>
        <div
          className="mermaid-sheet"
          role="img"
          aria-label={caption ?? 'Diagram'}
          dangerouslySetInnerHTML={{ __html: svg.replace(FONT_IMPORTS, '') }}
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
