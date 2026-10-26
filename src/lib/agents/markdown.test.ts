import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { markdownForPath, markdownResponse } from './markdown'

describe('Agent markdown', () => {
  test('renders the home page with discovery resources', () => {
    const { markdown, status } = markdownForPath('/')

    assert.equal(status, 200)
    assert.match(markdown, /^---\ntitle: "Laxman K R"/)
    assert.match(markdown, /## Agent resources/)
    assert.match(markdown, /https?:\/\/[^)\s]+\/llms\.txt/)
  })

  test('renders a post from MDX without component tags', () => {
    const { markdown, status } = markdownForPath('/blog/the-beauty-of-non-determinism')

    assert.equal(status, 200)
    assert.match(markdown, /^# The Beauty of Non-Determinism/m)
    assert.match(markdown, /https?:\/\/[^)\s]+\/content\/blog\//)
    assert.doesNotMatch(markdown, /<ThoughtExperiment>|<Term\b/)
  })

  test('renders a project with its links', () => {
    const { markdown, status } = markdownForPath('/projects/ascendant')

    assert.equal(status, 200)
    assert.match(markdown, /^# Ascendant/m)
    assert.match(markdown, /- \[Docs\]\(https:\/\/astro-ascendant\.vercel\.app\)/)
  })

  test('returns a markdown 404 for unknown pages', () => {
    const { markdown, status } = markdownForPath('/blog/does-not-exist')

    assert.equal(status, 404)
    assert.match(markdown, /# Not found/)
  })

  test('sets markdown response headers', () => {
    const response = markdownResponse('# Hello\n')

    assert.equal(response.status, 200)
    assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8')
    assert.equal(response.headers.get('vary'), 'Accept')
    assert.equal(response.headers.get('x-markdown-tokens'), '2')
    assert.match(response.headers.get('link') ?? '', /rel="api-catalog"/)
  })
})
