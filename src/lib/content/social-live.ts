import { cacheLife, cacheTag } from 'next/cache'

import type { GitHubSnapshot, SocialSnapshot } from '~/components/social/social-cards'
import bakedGithub from '~/content/github.json'
import bakedSocial from '~/content/social.json'

export interface SocialData {
  x: SocialSnapshot
  linkedin: SocialSnapshot
}

// Live GitHub numbers come from Cache Components so they refresh without a
// rebuild; the baked src/content/github.json snapshot stays as the fallback seed —
// builds and outages degrade to the last committed numbers instead of an
// empty card. The account is read from the baked snapshot itself so app and
// refresh scripts share one source of truth. X and LinkedIn have no public
// endpoint, so their cards are static identity only.

export async function getGitHub(): Promise<GitHubSnapshot> {
  'use cache'
  cacheLife({ stale: 21_600, revalidate: 21_600, expire: 604_800 })
  cacheTag('social-live')

  try {
    const user = (bakedGithub as GitHubSnapshot).user
    const [contrib, profile] = await Promise.all([
      fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`).then((r) => {
        if (!r.ok) throw new Error(`contributions ${r.status}`)
        return r.json()
      }),
      fetch(`https://api.github.com/users/${user}`, {
        headers: { accept: 'application/vnd.github+json', 'user-agent': user },
      }).then((r) => {
        if (!r.ok) throw new Error(`user ${r.status}`)
        return r.json()
      }),
    ])
    const days: Array<{ date: string; level: number }> = contrib.contributions
    return {
      user,
      followers: profile.followers,
      total: contrib.total.lastYear,
      to: days[days.length - 1].date,
      levels: days.map((d) => d.level).join(''),
    }
  } catch {
    return bakedGithub as GitHubSnapshot
  }
}

export async function getSocial(): Promise<SocialData> {
  return bakedSocial as SocialData
}
