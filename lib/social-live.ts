import { cacheLife, cacheTag } from 'next/cache'

import type { GitHubSnapshot, SocialSnapshot } from '~/components/social-cards'
import bakedGithub from '~/content/github.json'
import bakedSocial from '~/content/social.json'

export interface SocialData {
  x: SocialSnapshot
  linkedin: SocialSnapshot
}

// Live social numbers use Cache Components so counts refresh without a
// rebuild. The baked content/*.json snapshots stay as fallback seeds —
// builds and outages degrade to the last committed numbers instead of an
// empty card. X and LinkedIn have no public endpoints; their counts stay
// manual in content/social.json.

export async function getGitHub(): Promise<GitHubSnapshot> {
  'use cache'
  cacheLife({ stale: 21_600, revalidate: 21_600, expire: 604_800 })
  cacheTag('social-live')

  try {
    const [contrib, user] = await Promise.all([
      fetch('https://github-contributions-api.jogruber.de/v4/thaletto?y=last').then((r) => {
        if (!r.ok) throw new Error(`contributions ${r.status}`)
        return r.json()
      }),
      fetch('https://api.github.com/users/thaletto', {
        headers: { accept: 'application/vnd.github+json', 'user-agent': 'thaletto' },
      }).then((r) => {
        if (!r.ok) throw new Error(`user ${r.status}`)
        return r.json()
      }),
    ])
    const days: Array<{ date: string; level: number }> = contrib.contributions
    return {
      user: 'thaletto',
      followers: user.followers,
      total: contrib.total.lastYear,
      to: days[days.length - 1].date,
      levels: days.map((d) => d.level).join(''),
    }
  } catch {
    return bakedGithub as GitHubSnapshot
  }
}

export async function getSocial(): Promise<SocialData> {
  'use cache'
  cacheLife({ stale: 43_200, revalidate: 43_200, expire: 604_800 })
  cacheTag('social-live')

  return bakedSocial as SocialData
}
