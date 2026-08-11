import { cacheLife, cacheTag } from 'next/cache'

import type { NotionSnapshot, SocialSnapshot } from '~/components/social/social-cards'
import bakedGithub from '~/content/github.json'
import { type GitHubActivity, loadGitHubActivity } from '~/lib/content/github-activity'
import { siteIdentity, siteSocial } from '~/lib/content/personal'

export interface SocialData {
  x: SocialSnapshot
  linkedin: SocialSnapshot
  notion: NotionSnapshot
}

// Live GitHub numbers come from Cache Components so they refresh without a
// rebuild; the baked src/content/github.json snapshot stays as the fallback seed —
// builds and outages degrade to the last committed numbers instead of an
// empty card. The account identity comes from src/content/site.json. X and
// LinkedIn have no public endpoint, so their cards are static identity only.

export async function getGitHub(): Promise<GitHubActivity> {
  'use cache'
  cacheLife({ stale: 21_600, revalidate: 21_600, expire: 604_800 })
  cacheTag('social-live')

  return loadGitHubActivity({
    user: siteSocial.github.user,
    fetcher: fetch,
    fallback: bakedGithub,
  })
}

export async function getSocial(): Promise<SocialData> {
  return {
    x: siteSocial.x,
    linkedin: { name: siteIdentity.name, ...siteSocial.linkedin },
    notion: siteSocial.notion,
  }
}
