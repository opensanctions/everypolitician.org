import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/pages', () => ({
  getPageByPath: vi.fn().mockResolvedValue({
    path: '/docs/pep/methodology/',
    title: 'PEP Methodology',
    summary: 'How we classify PEPs',
    body: '<p>Methodology content</p>',
    url: 'https://www.everypolitician.org/docs/pep/methodology/',
    menu_path: '/docs/pep/methodology/',
    no_index: false,
    date_created: '2024-01-01',
    date_updated: '2024-01-01',
  }),
  getPathMetadata: vi.fn().mockResolvedValue({ title: 'PEP Methodology' }),
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

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => { throw new Error('NEXT_NOT_FOUND') }),
}))

import Page from './page'
import { getPageByPath } from '@/lib/pages'
import { notFound } from 'next/navigation'

describe('/docs/[...slug] page', () => {
  it('renders nested documentation page', async () => {
    const params = Promise.resolve({ slug: ['pep', 'methodology'] })
    const PageComponent = await Page({ params })
    render(PageComponent)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('PEP Methodology')
    expect(getPageByPath).toHaveBeenCalledWith('/docs/pep/methodology/')
  })

  it('calls notFound when page does not exist', async () => {
    vi.mocked(getPageByPath).mockResolvedValueOnce(null)
    const params = Promise.resolve({ slug: ['nonexistent'] })

    await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
  })
})
