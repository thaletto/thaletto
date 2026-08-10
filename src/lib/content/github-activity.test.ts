import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { type GitHubActivity, loadGitHubActivity, normalizeGitHubActivity } from './github-activity'

const contributionData = {
  total: { lastYear: 3 },
  contributions: [
    { date: '2026-08-09', level: 1 },
    { date: '2026-08-10', level: 2 },
  ],
}
const userData = { login: 'ada', followers: 42 }

describe('GitHub Activity', () => {
  test('normalizes a valid contribution range', () => {
    assert.deepEqual(normalizeGitHubActivity(contributionData, userData, 'ada'), {
      user: 'ada',
      followers: 42,
      total: 3,
      from: '2026-08-09',
      to: '2026-08-10',
      levels: '12',
    })
  })

  test('rejects account, range, order, and level mismatches', () => {
    assert.throws(() => normalizeGitHubActivity(contributionData, userData, 'grace'), /account/)
    assert.throws(
      () => normalizeGitHubActivity({ ...contributionData, contributions: [] }, userData, 'ada'),
      /range/,
    )
    assert.throws(
      () =>
        normalizeGitHubActivity(
          { ...contributionData, contributions: [...contributionData.contributions].reverse() },
          userData,
          'ada',
        ),
      /strictly increasing/,
    )
    assert.throws(
      () =>
        normalizeGitHubActivity(
          { ...contributionData, contributions: [{ date: '2026-08-10', level: 5 }] },
          userData,
          'ada',
        ),
      /level/,
    )
  })

  test('uses the baked adapter when live retrieval fails', async () => {
    const fallback: GitHubActivity = {
      user: 'ada',
      followers: 40,
      total: 2,
      from: '2026-08-08',
      to: '2026-08-09',
      levels: '11',
    }
    const activity = await loadGitHubActivity({
      user: 'ada',
      fallback,
      fetcher: async () => {
        throw new Error('offline')
      },
    })

    assert.deepEqual(activity, fallback)
  })
})
