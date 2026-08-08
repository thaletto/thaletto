declare module 'subset-font' {
  export default function subsetFont(
    font: Buffer,
    text: string,
    options?: {
      targetFormat?: 'sfnt' | 'woff' | 'woff2'
      preserveNameIds?: number[]
      variationAxes?: Record<string, number | { min: number; max: number; default?: number }>
    },
  ): Promise<Buffer>
}
