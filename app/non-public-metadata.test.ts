import { describe, expect, it } from 'vitest'

import {
  nonPublicDescriptions,
  nonPublicRobots,
} from '~/lib/non-public-metadata'

describe('non-public route metadata', () => {
  it('keeps not-found surfaces out of indexes', () => {
    expect(nonPublicRobots).toEqual({ index: false, follow: false })
    expect(nonPublicDescriptions).toEqual({
      notFound: '地址没有坏，只是这里还没有留下印迹。',
    })
  })
})
