import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import {
  parseSiteProfile,
  siteDestinations,
  siteExperience,
  siteIdentity,
  siteSocial,
} from './personal'

const validProfile = {
  identity: {
    name: 'Ada Lovelace',
    firstName: 'Ada',
    role: 'Programmer',
    email: 'ada@example.com',
    country: 'United Kingdom',
    homeCity: 'London',
    portraitAlt: "Ada's portrait",
    location: { latitude: '51.5072° N', longitude: '0.1276° W' },
  },
  social: {
    x: { name: 'Ada', handle: 'ada', bio: 'Computing pioneer' },
    linkedin: { handle: 'ada-lovelace', bio: 'Computing pioneer' },
    notion: { name: 'Notes', url: 'https://example.com/notes', bio: 'Research notes' },
    github: { user: 'ada' },
  },
  resumes: {
    primary: 'https://example.com/resume.pdf',
    alternate: 'https://example.com/resume-alt.pdf',
  },
  experience: [],
}

describe('Site Profile', () => {
  test('normalizes authored identity and profile destinations', () => {
    const profile = parseSiteProfile(validProfile)

    assert.deepEqual(profile.identity, validProfile.identity)
    assert.deepEqual(profile.destinations, {
      x: 'https://x.com/ada',
      linkedin: 'https://www.linkedin.com/in/ada-lovelace/',
      github: 'https://github.com/ada',
      resume: 'https://example.com/resume.pdf',
      alternateResume: 'https://example.com/resume-alt.pdf',
    })
  })

  test('reports the invalid authored field', () => {
    assert.throws(
      () =>
        parseSiteProfile({
          ...validProfile,
          identity: { ...validProfile.identity, email: 'not-an-email' },
        }),
      /identity\.email/,
    )
  })

  test('rejects missing required values and invalid destinations', () => {
    const { role: _role, ...identityWithoutRole } = validProfile.identity
    assert.throws(
      () => parseSiteProfile({ ...validProfile, identity: identityWithoutRole }),
      /identity\.role/,
    )
    assert.throws(
      () =>
        parseSiteProfile({
          ...validProfile,
          resumes: { ...validProfile.resumes, primary: 'not-a-url' },
        }),
      /resumes\.primary/,
    )
    assert.throws(
      () =>
        parseSiteProfile({
          ...validProfile,
          social: {
            ...validProfile.social,
            notion: { ...validProfile.social.notion, url: 'not-a-url' },
          },
        }),
      /social\.notion\.url/,
    )
  })

  test('accepts omitted optional profile fields', () => {
    const profile = parseSiteProfile({
      ...validProfile,
      social: {
        x: { name: 'Ada', handle: 'ada' },
        linkedin: { handle: 'ada-lovelace' },
        notion: { name: 'Notes', url: 'https://example.com/notes' },
        github: { user: 'ada' },
      },
      experience: [
        {
          id: 'analytical-engine',
          company: 'Analytical Engine',
          role: 'Programmer',
          startDate: '1842.01',
        },
      ],
    })

    assert.equal(profile.social.x.bio, undefined)
    assert.deepEqual(profile.experience[0], {
      id: 'analytical-engine',
      company: 'Analytical Engine',
      role: 'Programmer',
      start: { year: 1842, month: 1 },
      end: undefined,
      yearRange: '1842—now',
      url: undefined,
      timelinePhoto: undefined,
    })
  })

  test('publishes the real authored record through the Site Profile interface', () => {
    assert.ok(siteIdentity.name.length > 0)
    assert.ok(siteSocial.github.user.length > 0)
    assert.match(siteDestinations.resume, /^https:\/\//)
    assert.ok(siteExperience.length > 0)
  })

  test('normalizes current and completed experience for callers', () => {
    const profile = parseSiteProfile({
      ...validProfile,
      experience: [
        {
          id: 'analytical-engine',
          company: 'Analytical Engine',
          role: 'Programmer',
          startDate: '1842.01',
          timelinePhoto: { src: '/timeline/engine.jpg', alt: 'Analytical Engine' },
        },
        {
          id: 'notes',
          company: 'Scientific Memoirs',
          role: 'Translator',
          startDate: '1842.02',
          endDate: '1843.08',
        },
      ],
    })

    assert.deepEqual(profile.experience[0], {
      id: 'analytical-engine',
      company: 'Analytical Engine',
      role: 'Programmer',
      start: { year: 1842, month: 1 },
      end: undefined,
      yearRange: '1842—now',
      url: undefined,
      timelinePhoto: { src: '/timeline/engine.jpg', alt: 'Analytical Engine' },
    })
    assert.equal(profile.experience[1].yearRange, '1842—1843')
    assert.deepEqual(profile.experience[1].end, { year: 1843, month: 8 })
  })

  test('rejects malformed and impossible experience dates', () => {
    for (const startDate of ['1842', '1842.13', 'year.01']) {
      assert.throws(
        () =>
          parseSiteProfile({
            ...validProfile,
            experience: [
              {
                id: 'analytical-engine',
                company: 'Analytical Engine',
                role: 'Programmer',
                startDate,
              },
            ],
          }),
        /experience\.0\.startDate/,
      )
    }
  })
})
