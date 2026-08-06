interface MdastNode {
  type: string
  lang?: string | null
  meta?: string | null
  value?: string
  children?: MdastNode[]
}

// ```mermaid fences become <MermaidDiagram> before rehype-pretty-code can
// claim them as code blocks. Caption rides on the fence meta:
// ```mermaid caption="..."
export default function remarkMermaid() {
  return function transform(tree: MdastNode) {
    function visit(node: MdastNode) {
      node.children?.forEach((child, index) => {
        if (child.type === 'code' && child.lang === 'mermaid') {
          const caption = child.meta?.match(/caption="([^"]+)"/)?.[1]
          node.children![index] = {
            type: 'mdxJsxFlowElement',
            name: 'MermaidDiagram',
            attributes: [
              { type: 'mdxJsxAttribute', name: 'code', value: child.value ?? '' },
              ...(caption
                ? [{ type: 'mdxJsxAttribute', name: 'caption', value: caption }]
                : []),
            ],
            children: [],
          } as MdastNode
          return
        }
        visit(child)
      })
    }

    visit(tree)
  }
}
