// Refreshes content/github.json (contribution levels for the hover card).
//   node scripts/refresh-github.mjs
import { writeFileSync } from 'node:fs'

import { buildGithubSnapshot } from './refresh-snapshot-validation.mjs'

const contributionResponse = await fetch(
  'https://github-contributions-api.jogruber.de/v4/CaliCastle?y=last',
)
if (!contributionResponse.ok) {
  throw new Error(`GitHub contribution refresh failed with HTTP ${contributionResponse.status}`)
}

const userResponse = await fetch('https://api.github.com/users/CaliCastle', {
  headers: { accept: 'application/vnd.github+json', 'user-agent': 'cali.so' },
})
if (!userResponse.ok) {
  throw new Error(`GitHub user refresh failed with HTTP ${userResponse.status}`)
}

const snapshot = buildGithubSnapshot(
  await contributionResponse.json(),
  await userResponse.json(),
)

// codeql[js/http-to-file-access] -- Fixed path with bounded fields.
writeFileSync(
  'content/github.json',
  JSON.stringify(snapshot, null, 2) + '\n',
)
console.log('saved', snapshot.levels.length, 'days')
