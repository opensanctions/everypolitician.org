import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import Page from './page'

describe('/docs page', () => {
  it('renders the documentation index page', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    // Should show the documentation title (appears in both menu and content)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings.some(h => h.textContent === 'Documentation')).toBe(true)
  })

  it('displays navigation content', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    // Should contain links to other docs pages
    expect(screen.getByText(/About EveryPolitician/i)).toBeInTheDocument()
  })
})
