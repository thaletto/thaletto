// Refreshes src/content/github.json (contribution levels for the hover card).
// Hooks into the build via package.json "prebuild" so the committed baked
// fallback is refreshed from the account's real data on every deploy.
// Run with --best-effort to fail softly: a transient GitHub outage must never
// block a build, so it keeps the last good snapshot and logs a warning.
//   node src/scripts/refresh-github.mjs [--best-effort]
import { writeFileSync } from 'node:fs'

import { GITHUB_USER, GITHUB_USER_AGENT } from './refresh-config.mjs'
import { buildGithubSnapshot } from './refresh-snapshot-validation.mjs'

const bestEffort = process.argv.includes('--best-effort')

async function refresh() {
  const contributionResponse = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`,
  )
  if (!contributionResponse.ok) {
    throw new Error(`GitHub contribution refresh failed with HTTP ${contributionResponse.status}`)
  }

  const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
    headers: { accept: 'application/vnd.github+json', 'user-agent': GITHUB_USER_AGENT },
  })
  if (!userResponse.ok) {
    throw new Error(`GitHub user refresh failed with HTTP ${userResponse.status}`)
  }

  const snapshot = buildGithubSnapshot(await contributionResponse.json(), await userResponse.json())

  // codeql[js/http-to-file-access] -- Fixed path with bounded fields.
  writeFileSync('src/content/github.json', `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log('saved', snapshot.levels.length, 'days')
}

refresh().catch((error) => {
  if (bestEffort) {
    console.warn(`GitHub snapshot refresh skipped, keeping last good data: ${error.message}`)
    process.exit(0)
  }
  console.error(error)
  process.exit(1)
})
