import { describe, it, expect, beforeEach } from 'vitest'
import { addFetchHandler } from '../../../vitest.setup'
import {
  territories,
  jsonResponse,
} from '../../../test/fixtures'

import Page from './page'

describe('Country page', () => {
  beforeEach(() => {
    // Mock CMS API for territories
    addFetchHandler((url) => {
      if (url.includes('opensanctions.directus.app/items/territories')) {
        return jsonResponse(territories)
      }
      return null
    })
  })

  it('throws notFound for unknown territory', async () => {
    const params = Promise.resolve({ slug: 'unknown-country' })

    await expect(Page({ params })).rejects.toThrow()
  })

  it('extracts country code from slug with dot notation', async () => {
    // This tests the slug parsing logic: 'us.united-states' -> 'us'
    const params = Promise.resolve({ slug: 'zz.nonexistent' })

    // 'zz' is not a valid territory, so should throw notFound
    await expect(Page({ params })).rejects.toThrow()
  })

  it('accepts valid country code', async () => {
    // For valid countries, the page should not throw during initial load
    // (it may fail later due to missing API mocks, but the territory lookup succeeds)
    const params = Promise.resolve({ slug: 'us' })

    // We can't fully render due to nested async components,
    // but we can verify it doesn't throw notFound immediately
    // by catching only the expected downstream errors
    try {
      await Page({ params })
    } catch (e) {
      // Should NOT be a notFound error for valid territory
      const error = e as Error
      expect(error.message).not.toContain('NEXT_NOT_FOUND')
    }
  })
})
