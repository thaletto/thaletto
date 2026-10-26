import { cacheLife, cacheTag } from 'next/cache'

import type { NotionSnapshot, SocialSnapshot } from '~/components/social/social-cards'
import bakedGithub from '~/content/github.json'
import { type GitHubActivity, loadGitHubActivity } from '~/lib/content/github-activity'
import { siteIdentity, siteSocial } from '~/lib/content/personal'

interface SocialData {
  x: SocialSnapshot
  linkedin: SocialSnapshot
  notion: NotionSnapshot
}

// Live counts come from the Next cache; the baked snapshot is the outage fallback.
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

// X and LinkedIn expose no public counts, so those cards stay static identity.
export async function getSocial(): Promise<SocialData> {
  return {
    x: siteSocial.x,
    linkedin: { name: siteIdentity.name, ...siteSocial.linkedin },
    notion: siteSocial.notion,
  }
}
