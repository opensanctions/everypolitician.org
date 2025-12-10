import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/pages', () => ({
  getPageByPath: vi.fn().mockResolvedValue({
    path: '/docs/',
    title: 'Documentation',
    summary: 'Test summary',
    body: '<p>Test content</p>',
    url: 'https://www.everypolitician.org/docs/',
    menu_path: '/docs/',
    no_index: false,
    date_created: '2024-01-01',
    date_updated: '2024-01-01',
  }),
  getPathMetadata: vi.fn().mockResolvedValue({ title: 'Documentation' }),
}))

vi.mock('@/components/layout/LayoutFrame', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

vi.mock('@/components/Content', () => ({
  default: {
    Page: ({ content }: { content: { title: string; body: string } }) => (
      <div data-testid="content-page">
        <h1>{content.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content.body }} />
      </div>
    ),
  },
}))

import Page from './page'

describe('/docs page', () => {
  it('renders documentation page with content', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByTestId('content-page')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Documentation')
  })
})
