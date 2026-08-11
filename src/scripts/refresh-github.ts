// Refreshes the baked GitHub Activity adapter used when live retrieval fails.
import { writeFileSync } from 'node:fs'

import { loadGitHubActivity } from '../lib/content/github-activity'
import { siteSocial } from '../lib/content/personal'

const bestEffort = process.argv.includes('--best-effort')

async function refresh() {
  const { user: _, ...snapshot } = await loadGitHubActivity({ user: siteSocial.github.user })
  writeFileSync('src/content/github.json', `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log('saved', snapshot.levels.length, 'days')
}

refresh().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  if (bestEffort) {
    console.warn(`GitHub snapshot refresh skipped, keeping last good data: ${message}`)
    process.exit(0)
  }
  console.error(error)
  process.exit(1)
})
