import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildGithubSnapshot,
  parseYouTubeSnapshot,
  updateSocialSnapshot,
} from './refresh-snapshot-validation.mjs'

test('parses a bounded YouTube follower snapshot', () => {
  assert.deepEqual(
    parseYouTubeSnapshot(
      '<span>1.91K subscribers</span>',
      new Date('2026-07-19T00:00:00.000Z'),
    ),
    { followers: '1.91K', asOf: '2026-07' },
  )
  assert.throws(() => parseYouTubeSnapshot('<span>many subscribers</span>'))
})

test('updates only the validated YouTube snapshot fields', () => {
  const current = {
    x: { followers: '10' },
    youtube: { name: 'Cali Castle', followers: '1K', asOf: '2026-06' },
  }

  assert.deepEqual(
    updateSocialSnapshot(current, { followers: '1.91K', asOf: '2026-07' }),
    {
      x: { followers: '10' },
      youtube: { name: 'Cali Castle', followers: '1.91K', asOf: '2026-07' },
    },
  )
  assert.equal(current.youtube.followers, '1K')
})

test('builds a bounded GitHub snapshot from validated primitives', () => {
  assert.deepEqual(
    buildGithubSnapshot(
      {
        total: { lastYear: 8 },
        contributions: [
          { date: '2026-07-18', level: 0 },
          { date: '2026-07-19', level: 4 },
        ],
      },
      { login: 'CaliCastle', followers: 865 },
    ),
    {
      user: 'CaliCastle',
      followers: 865,
      total: 8,
      from: '2026-07-18',
      to: '2026-07-19',
      levels: '04',
    },
  )
})

test('rejects malformed or unbounded GitHub responses', () => {
  const user = { login: 'CaliCastle', followers: 865 }

  assert.throws(() =>
    buildGithubSnapshot(
      { total: { lastYear: 1 }, contributions: [{ date: 'invalid', level: 1 }] },
      user,
    ),
  )
  assert.throws(() =>
    buildGithubSnapshot(
      { total: { lastYear: 1 }, contributions: [{ date: '2026-07-19', level: 9 }] },
      user,
    ),
  )
  assert.throws(() =>
    buildGithubSnapshot(
      { total: { lastYear: 1 }, contributions: [] },
      user,
    ),
  )
})
