import assert from 'node:assert/strict'

const githubUser = 'CaliCastle'
const isoDate = /^\d{4}-\d{2}-\d{2}$/
const youtubeFollowerCount = /^(?:\d{1,9}|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?[KM]?$/

function assertRecord(value, label) {
  assert.ok(
    value && typeof value === 'object' && !Array.isArray(value),
    `${label} must be an object`,
  )
}

function assertNonNegativeInteger(value, label) {
  assert.ok(Number.isSafeInteger(value) && value >= 0, `${label} must be a non-negative integer`)
}

function validatedDate(value, label) {
  assert.equal(typeof value, 'string', `${label} must be a string`)
  assert.match(value, isoDate, `${label} must use YYYY-MM-DD`)
  assert.equal(new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10), value)
  return value
}

function contributionLevel(value) {
  switch (value) {
    case 0:
      return '0'
    case 1:
      return '1'
    case 2:
      return '2'
    case 3:
      return '3'
    case 4:
      return '4'
    default:
      throw new Error(`invalid GitHub contribution level: ${value}`)
  }
}

export function parseYouTubeSnapshot(html, now = new Date()) {
  assert.equal(typeof html, 'string')
  assert.ok(html.length <= 5_000_000, 'YouTube response is unexpectedly large')

  const match = html.match(/([\d.,]+[KM]?) subscribers\b/)
  assert.ok(match, 'subscriber count not found; YouTube markup changed')
  assert.match(match[1], youtubeFollowerCount, 'subscriber count has an unexpected format')
  assert.ok(Number.isFinite(now.getTime()), 'snapshot date must be valid')

  return {
    followers: match[1],
    asOf: now.toISOString().slice(0, 7),
  }
}

export function updateSocialSnapshot(social, youtube) {
  assertRecord(social, 'social snapshot')
  assertRecord(social.youtube, 'social snapshot YouTube entry')
  assertRecord(youtube, 'YouTube refresh')
  assert.match(youtube.followers, youtubeFollowerCount)
  assert.match(youtube.asOf, /^\d{4}-\d{2}$/)

  return {
    ...social,
    youtube: {
      ...social.youtube,
      followers: youtube.followers,
      asOf: youtube.asOf,
    },
  }
}

export function buildGithubSnapshot(contributionData, userData) {
  assertRecord(contributionData, 'GitHub contribution response')
  assertRecord(contributionData.total, 'GitHub contribution totals')
  assertRecord(userData, 'GitHub user response')
  assert.equal(
    userData.login,
    githubUser,
    'GitHub response user does not match the requested account',
  )
  assertNonNegativeInteger(userData.followers, 'GitHub follower count')
  assertNonNegativeInteger(contributionData.total.lastYear, 'GitHub contribution total')

  const days = contributionData.contributions
  assert.ok(Array.isArray(days), 'GitHub contributions must be an array')
  assert.ok(days.length >= 1 && days.length <= 400, 'GitHub contribution range is out of bounds')

  const normalizedDays = days.map((day, index) => {
    assertRecord(day, `GitHub contribution day ${index}`)
    return {
      date: validatedDate(day.date, `GitHub contribution day ${index} date`),
      level: contributionLevel(day.level),
    }
  })

  for (let index = 1; index < normalizedDays.length; index += 1) {
    assert.ok(
      normalizedDays[index - 1].date < normalizedDays[index].date,
      'GitHub contribution dates must be strictly increasing',
    )
  }

  return {
    user: githubUser,
    followers: userData.followers,
    total: contributionData.total.lastYear,
    from: normalizedDays[0].date,
    to: normalizedDays[normalizedDays.length - 1].date,
    levels: normalizedDays.map((day) => day.level).join(''),
  }
}
