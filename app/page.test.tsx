import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/data', () => ({
  fetchApiCached: vi.fn().mockResolvedValue({
    facets: {
      countries: {
        label: 'Countries',
        values: [
          { name: 'us', label: 'United States', count: 100 },
          { name: 'gb', label: 'United Kingdom', count: 50 },
        ],
      },
    },
  }),
  getDatasetByName: vi.fn().mockResolvedValue({
    name: 'peps',
    title: 'PEPs',
    hidden: false,
  }),
  getDatasetsByScope: vi.fn().mockResolvedValue([
    { name: 'source1', title: 'Source 1', type: 'source', hidden: false },
  ]),
}))

vi.mock('@/lib/pages', () => ({
  getPageByPath: vi.fn().mockResolvedValue(null),
}))

vi.mock('@/lib/territory', () => ({
  getTerritoryInfo: vi.fn().mockResolvedValue({
    code: 'us',
    label_short: 'United States',
    region: 'Americas',
    subregion: 'North America',
  }),
}))

vi.mock('@/components/layout/LayoutFrame', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

vi.mock('@/components/Dataset', () => ({
  default: {
    Table: () => <div data-testid="dataset-table">Dataset Table</div>,
  },
}))

vi.mock('@/components/Policy', () => ({
  LicenseInfo: () => <div data-testid="license-info">License</div>,
}))

vi.mock('@/components/clientUtil', () => ({
  HelpLink: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

import Page from './page'

describe('/ homepage', () => {
  it('renders the homepage with claim and territory table', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByText('Who is running the world?')).toBeInTheDocument()
  })
})
