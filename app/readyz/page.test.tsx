import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/data', () => ({
  getDatasetByName: vi.fn().mockResolvedValue({ name: 'default', title: 'Default' }),
  getCatalogEntriesByScope: vi.fn().mockResolvedValue([{ name: 'test', title: 'Test' }]),
}))

import CheckReady from './page'

describe('/readyz health check', () => {
  it('renders ok message when data is available', async () => {
    const Page = await CheckReady()
    render(Page)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('ok :)')
  })
})
