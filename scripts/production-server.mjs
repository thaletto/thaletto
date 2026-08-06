import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

async function waitForServer(baseUrl, child) {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Next.js exited with code ${child.exitCode}`)
    }
    try {
      const response = await fetch(baseUrl, { redirect: 'manual' })
      if (response.status > 0) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`Timed out waiting for ${baseUrl}`)
}

async function waitForBaseUrl(child, output) {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Next.js exited with code ${child.exitCode}`)
    }
    const match = output().match(/Local:\s+(http:\/\/(?:localhost|127\.0\.0\.1):\d+)/)
    if (match) return match[1]
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  throw new Error('Timed out waiting for Next.js to announce its local URL')
}

export async function openProductionServer(externalBaseUrl) {
  if (externalBaseUrl) {
    return { baseUrl: externalBaseUrl, stop: async () => undefined }
  }

  await readFile(path.join(root, '.next/BUILD_ID'), 'utf8').catch(() => {
    throw new Error('Run pnpm build before the production HTTP verifier')
  })

  const child = spawn(
    process.execPath,
    [
      path.join(root, 'node_modules/next/dist/bin/next'),
      'start',
      '--hostname',
      'localhost',
      '--port',
      '0',
    ],
    {
      cwd: root,
      env: {
        ...process.env,
        FORCE_COLOR: '0',
        NODE_ENV: 'production',
        NO_COLOR: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )
  let output = ''
  child.stdout.on('data', (chunk) => (output += chunk))
  child.stderr.on('data', (chunk) => (output += chunk))

  try {
    const baseUrl = await waitForBaseUrl(child, () => output)
    await waitForServer(baseUrl, child)

    return {
      baseUrl,
      stop: async () => {
        if (child.exitCode !== null || !child.kill('SIGTERM')) return
        await new Promise((resolve) => {
          const timer = setTimeout(resolve, 5_000)
          child.once('exit', () => {
            clearTimeout(timer)
            resolve()
          })
        })
      },
    }
  } catch (error) {
    child.kill('SIGTERM')
    throw new Error(`${error.message}\n${output}`)
  }
}
