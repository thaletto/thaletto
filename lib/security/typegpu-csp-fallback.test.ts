import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { expect, it } from 'vitest'

const CSP_FALLBACK_WARNING =
  'This environment does not allow eval - using default writer as fallback'

it('warns only once when TypeGPU falls back under a strict CSP', () => {
  // Locate typegpu through its dependent: typegpu is a transitive
  // dependency of shaders, so the copy pnpm links next to shaders is the
  // one the app actually loads — with the warn-once patch applied.
  // Globbing .pnpm directly can surface an orphaned pre-patch copy in
  // unspecified match order. (compiledIO.js is not an exported subpath,
  // so it is loaded by file URL instead of a bare specifier.)
  const shadersDir = realpathSync(
    resolve(process.cwd(), 'node_modules/shaders'),
  )
  const compiledIoPath = resolve(shadersDir, '../typegpu/data/compiledIO.js')
  expect(
    existsSync(compiledIoPath),
    `typegpu is no longer linked beside shaders (${compiledIoPath}) — update this test's resolution path`,
  ).toBe(true)
  expect(
    readFileSync(compiledIoPath, 'utf8'),
    'patches/typegpu@0.11.9.patch is not applied — run pnpm install',
  ).toContain('didWarnAboutEvalFallback')

  const script = `
    const { getCompiledWriter } = await import(${JSON.stringify(pathToFileURL(compiledIoPath).href)})
    getCompiledWriter({})
    getCompiledWriter({})
    getCompiledWriter({})
  `
  const result = spawnSync(
    process.execPath,
    [
      '--disallow-code-generation-from-strings',
      '--input-type=module',
      '--eval',
      script,
    ],
    { encoding: 'utf8' },
  )

  expect(result.status, result.stderr).toBe(0)
  expect(result.stderr.match(new RegExp(CSP_FALLBACK_WARNING, 'g'))).toHaveLength(1)
})
