import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { prefersMarkdown } from './negotiation'

describe('Markdown content negotiation', () => {
  test('prefers markdown when it is the only acceptable type', () => {
    assert.equal(prefersMarkdown('text/markdown'), true)
  })

  test('prefers markdown when it outranks html', () => {
    assert.equal(prefersMarkdown('text/markdown, text/html;q=0.9'), true)
  })

  test('keeps html when html outranks markdown', () => {
    assert.equal(prefersMarkdown('text/html, text/markdown;q=0.5'), false)
  })

  test('keeps html for wildcard clients', () => {
    assert.equal(prefersMarkdown('*/*'), false)
    assert.equal(prefersMarkdown('text/html'), false)
    assert.equal(prefersMarkdown(null), false)
  })

  test('honours an explicit markdown rejection', () => {
    assert.equal(prefersMarkdown('text/html, text/markdown;q=0'), false)
  })
})
