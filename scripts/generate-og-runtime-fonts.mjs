import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import subsetFont from 'subset-font'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const fontsDirectory = path.join(root, 'app/_fonts')

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const absolutePath = path.join(directory, entry.name)
      return entry.isDirectory() ? sourceFiles(absolutePath) : [absolutePath]
    }),
  )
  return files.flat()
}

const contentFiles = (
  await Promise.all(
    ['content/blog', 'content/projects'].map((directory) =>
      sourceFiles(path.join(root, directory)),
    ),
  )
)
  .flat()
  .filter((file) => file.endsWith('.mdx'))

const copyFiles = [
  ...contentFiles,
  path.join(root, 'lib/date.ts'),
  path.join(root, 'lib/og-image.tsx'),
  path.join(root, 'lib/public-page-metadata.ts'),
]
const sourceText = (
  await Promise.all(copyFiles.map((file) => readFile(file, 'utf8')))
).join('\n')
const printableAscii = Array.from({ length: 95 }, (_, index) =>
  String.fromCharCode(index + 32),
).join('')
const glyphs = [...new Set(printableAscii + sourceText)].sort().join('')

for (const weight of ['Regular', 'SemiBold']) {
  const source = await readFile(
    path.join(fontsDirectory, `FrexSansGB-${weight}.woff2`),
  )
  const subset = await subsetFont(source, glyphs, { targetFormat: 'sfnt' })
  await writeFile(
    path.join(fontsDirectory, `FrexSansGB-OG-${weight}.ttf`),
    subset,
  )
}

console.log(`Generated OG runtime fonts for ${glyphs.length} glyphs`)
