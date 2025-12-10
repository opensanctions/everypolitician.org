import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/data', () => ({
  fetchApiCached: vi.fn().mockResolvedValue({
    facets: {
      topics: { label: 'Topics', values: [{ name: 'role.pep', label: 'PEP', count: 50 }] },
      schema: { label: 'Schema', values: [] },
    },
  }),
  getDatasetByName: vi.fn().mockResolvedValue({
    name: 'default',
    title: 'Default',
    type: 'collection',
    datasets: ['source1'],
  }),
  getDatasets: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/lib/territory', () => ({
  getTerritoriesByCode: vi.fn().mockResolvedValue(
    new Map([
      ['us', {
        code: 'us',
        label_short: 'United States',
        label_full: 'United States of America',
        in_sentence: 'the United States',
        flag: '🇺🇸',
        see: [],
        region: 'Americas',
        subregion: 'North America',
      }],
    ])
  ),
  getTerritoryInfo: vi.fn().mockResolvedValue({
    code: 'us',
    label_short: 'United States',
    in_sentence: 'the United States',
  }),
}))

vi.mock('@/lib/peps', () => ({
  getCountryPEPData: vi.fn().mockResolvedValue({
    positions: [],
  }),
}))

vi.mock('@/lib/datasets', () => ({
  getDatasetStatistics: vi.fn().mockResolvedValue({
    things: { countries: [{ code: 'us', count: 100 }] },
  }),
}))

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => { throw new Error('NEXT_NOT_FOUND') }),
}))

import { getTerritoriesByCode } from '@/lib/territory'
import { notFound } from 'next/navigation'

describe('/countries/[slug] page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls notFound for unknown territory', async () => {
    vi.mocked(getTerritoriesByCode).mockResolvedValueOnce(new Map())

    // Dynamically import to get fresh module with mocks
    const { default: Page } = await import('./page')
    const params = Promise.resolve({ slug: 'unknown' })

    await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
  })

  it('extracts country code from slug correctly', async () => {
    const { default: Page } = await import('./page')

    // Test with slug containing dots (e.g., "us.united-states")
    vi.mocked(getTerritoriesByCode).mockResolvedValueOnce(
      new Map([
        ['us', {
          code: 'us',
          label_short: 'United States',
          label_full: 'United States of America',
          in_sentence: 'the United States',
          flag: '🇺🇸',
          see: [],
          region: 'Americas',
          subregion: 'North America',
        }],
      ])
    )

    const params = Promise.resolve({ slug: 'us.united-states' })

    // This should not throw notFound since 'us' (before the dot) exists
    try {
      await Page({ params })
    } catch (e) {
      // Page may fail for other reasons (async components), but not notFound
      if ((e as Error).message === 'NEXT_NOT_FOUND') {
        throw new Error('Should have found territory')
      }
    }

    expect(notFound).not.toHaveBeenCalled()
  })
})
