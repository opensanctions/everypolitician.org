import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/assets', () => ({
  getCachedAssetData: vi.fn(),
}))

import { GET } from './route'
import { getCachedAssetData } from '@/lib/assets'

describe('/assets/[id] API route', () => {
  it('returns asset data with correct headers', async () => {
    const mockAsset = {
      data: Buffer.from('test-image-data').toString('base64'),
      contentType: 'image/png',
      contentDisposition: 'inline; filename="test.png"',
    }
    vi.mocked(getCachedAssetData).mockResolvedValue(mockAsset)

    const request = new Request('http://localhost/assets/abc123?height=100&width=200&quality=80')
    const params = Promise.resolve({ id: 'abc123' })

    const response = await GET(request, { params })

    expect(getCachedAssetData).toHaveBeenCalledWith('abc123', '100', '200', '80')
    expect(response.headers.get('Content-Type')).toBe('image/png')
    expect(response.headers.get('Content-Disposition')).toBe('inline; filename="test.png"')
    expect(response.headers.get('Cache-Control')).toContain('public')
  })

  it('uses default content type when not provided', async () => {
    const mockAsset = {
      data: Buffer.from('binary-data').toString('base64'),
      contentType: null,
      contentDisposition: null,
    }
    vi.mocked(getCachedAssetData).mockResolvedValue(mockAsset)

    const request = new Request('http://localhost/assets/xyz789')
    const params = Promise.resolve({ id: 'xyz789' })

    const response = await GET(request, { params })

    expect(response.headers.get('Content-Type')).toBe('application/octet-stream')
    expect(response.headers.get('Content-Disposition')).toBeNull()
  })

  it('passes null for missing query params', async () => {
    const mockAsset = {
      data: Buffer.from('data').toString('base64'),
      contentType: 'image/jpeg',
      contentDisposition: null,
    }
    vi.mocked(getCachedAssetData).mockResolvedValue(mockAsset)

    const request = new Request('http://localhost/assets/test-id')
    const params = Promise.resolve({ id: 'test-id' })

    await GET(request, { params })

    expect(getCachedAssetData).toHaveBeenCalledWith('test-id', null, null, null)
  })
})
