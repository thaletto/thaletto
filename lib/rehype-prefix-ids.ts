interface HastNode {
  properties?: Record<string, unknown>
  children?: HastNode[]
}

export default function rehypePrefixIds({ prefix }: { prefix: string }) {
  return function transform(tree: HastNode) {
    function visit(node: HastNode) {
      const properties = node.properties
      if (properties) {
        if (typeof properties.id === 'string') properties.id = `${prefix}${properties.id}`
        if (typeof properties.href === 'string' && properties.href.startsWith('#')) {
          properties.href = `#${prefix}${properties.href.slice(1)}`
        }
      }
      node.children?.forEach(visit)
    }

    visit(tree)
  }
}
