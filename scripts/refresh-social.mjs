// Refreshes the YouTube subscriber count in content/social.json.
// (X follower count stays manual — no public endpoint worth scraping.)
//   node scripts/refresh-social.mjs
import { readFileSync, writeFileSync } from 'node:fs'

import {
  parseYouTubeSnapshot,
  updateSocialSnapshot,
} from './refresh-snapshot-validation.mjs'

const response = await fetch('https://www.youtube.com/@calicastle', {
  headers: { 'accept-language': 'en-US' },
})
if (!response.ok) throw new Error(`YouTube refresh failed with HTTP ${response.status}`)

const youtube = parseYouTubeSnapshot(await response.text())
const currentSocial = JSON.parse(readFileSync('content/social.json', 'utf8'))
const social = updateSocialSnapshot(currentSocial, youtube)

// codeql[js/http-to-file-access] -- Fixed path with bounded fields.
writeFileSync('content/social.json', JSON.stringify(social, null, 2) + '\n')
console.log('youtube subscribers:', youtube.followers)
