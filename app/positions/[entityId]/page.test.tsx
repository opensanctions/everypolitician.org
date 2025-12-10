import { describe, it, expect, beforeEach } from 'vitest'
import { addFetchHandler } from '../../../vitest.setup'
import {
  ftmModel,
  defaultDataset,
  jsonResponse,
} from '../../../test/fixtures'

import Page from './page'

const positionEntity = {
  id: 'pos-123',
  caption: 'President of Example',
  schema: 'Position',
  datasets: ['peps'],
  referents: [],
  properties: {
    name: ['President of Example'],
    country: ['us'],
  },
}

// Helper to create a minimal source dataset
function makeSourceDataset(name: string) {
  return {
    name,
    title: name.toUpperCase(),
    type: 'source',
    hidden: false,
    datasets: [],
    publisher: null,
  }
}

describe('Position page', () => {
  beforeEach(() => {
    // Mock model
    addFetchHandler((url) => {
      if (url.includes('data.opensanctions.org/artifacts/model/default.json')) {
        return jsonResponse(ftmModel)
      }
      return null
    })

    // Mock datasets
    addFetchHandler((url) => {
      if (url.includes('data.opensanctions.org/datasets/latest/default/index.json')) {
        return jsonResponse(defaultDataset)
      }
      const datasetMatch = url.match(/datasets\/latest\/([^/]+)\/index\.json/)
      if (datasetMatch) {
        return jsonResponse(makeSourceDataset(datasetMatch[1]))
      }
      return null
    })
  })

  it('throws notFound when entity does not exist', async () => {
    addFetchHandler((url) => {
      if (url.includes('api.opensanctions.org/entities/')) {
        return jsonResponse(null)
      }
      return null
    })

    const params = Promise.resolve({ entityId: 'nonexistent' })

    await expect(Page({ params })).rejects.toThrow()
  })

  it('redirects when entity ID differs from requested ID', async () => {
    addFetchHandler((url) => {
      if (url.includes('api.opensanctions.org/entities/')) {
        return jsonResponse({
          ...positionEntity,
          id: 'pos-456',
        })
      }
      return null
    })

    const params = Promise.resolve({ entityId: 'pos-123' })

    await expect(Page({ params })).rejects.toThrow('NEXT_REDIRECT')
  })

  it('does not throw notFound for valid position entity', async () => {
    addFetchHandler((url) => {
      if (url.includes('api.opensanctions.org/entities/pos-123/adjacent')) {
        return jsonResponse(null)
      }
      if (url.includes('api.opensanctions.org/entities/pos-123')) {
        return jsonResponse(positionEntity)
      }
      return null
    })

    const params = Promise.resolve({ entityId: 'pos-123' })

    try {
      await Page({ params })
    } catch (e) {
      const error = e as Error
      expect(error.message).not.toContain('NEXT_NOT_FOUND')
    }
  })
})
