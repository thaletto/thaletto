import { cacheLife, cacheTag } from 'next/cache'

import bakedGithub from '~/content/github.json'
import { type GitHubActivity, loadGitHubActivity } from '~/lib/content/github-activity'
import { siteSocial } from '~/lib/content/personal'

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
