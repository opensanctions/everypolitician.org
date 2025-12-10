import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockEntity = {
  id: 'Q123',
  caption: 'Test Person',
  schema: { name: 'Person' },
  datasets: ['default'],
  referents: [],
  getProperty: vi.fn().mockReturnValue([]),
  getDisplayProperties: vi.fn().mockReturnValue([]),
}

vi.mock('@/lib/data', () => ({
  getEntity: vi.fn().mockResolvedValue({
    id: 'Q123',
    caption: 'Test Person',
    schema: { name: 'Person' },
    datasets: ['default'],
    referents: [],
    getProperty: vi.fn().mockReturnValue([]),
    getDisplayProperties: vi.fn().mockReturnValue([]),
  }),
  getAdjacent: vi.fn().mockResolvedValue(null),
  getDatasets: vi.fn().mockResolvedValue([]),
  getEntityDatasets: vi.fn().mockResolvedValue([]),
  isBlocked: vi.fn().mockReturnValue(false),
}))

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => { throw new Error('NEXT_NOT_FOUND') }),
  redirect: vi.fn((url: string) => { throw new Error(`NEXT_REDIRECT:${url}`) }),
}))

import { getEntity } from '@/lib/data'
import { notFound, redirect } from 'next/navigation'

describe('/entities/[entityId] page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls notFound when entity does not exist', async () => {
    vi.mocked(getEntity).mockResolvedValueOnce(null)

    const { default: Page } = await import('./page')
    const params = Promise.resolve({ entityId: 'nonexistent' })

    await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
  })

  it('redirects when entity ID differs from requested ID', async () => {
    vi.mocked(getEntity).mockResolvedValueOnce({
      ...mockEntity,
      id: 'Q456', // Different from requested
    } as any)

    const { default: Page } = await import('./page')
    const params = Promise.resolve({ entityId: 'Q123' })

    await expect(Page({ params })).rejects.toThrow('NEXT_REDIRECT:/entities/Q456/')
    expect(redirect).toHaveBeenCalledWith('/entities/Q456/')
  })
})
