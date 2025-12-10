import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { addFetchHandler } from '../vitest.setup'
import {
  territories,
  defaultCatalog,
  pepsCatalog,
  searchResponse,
  ftmModel,
  jsonResponse,
} from '../test/fixtures'

import Page from './page'

describe('Homepage', () => {
  beforeEach(() => {
    // Mock CMS API for territories
    addFetchHandler((url) => {
      if (url.includes('opensanctions.directus.app/items/territories')) {
        return jsonResponse(territories)
      }
      return null
    })

    // Mock static data files
    addFetchHandler((url) => {
      if (url.includes('data.opensanctions.org/datasets/latest/default/catalog.json')) {
        return jsonResponse(defaultCatalog)
      }
      if (url.includes('data.opensanctions.org/datasets/latest/peps/catalog.json')) {
        return jsonResponse(pepsCatalog)
      }
      if (url.includes('data.opensanctions.org/artifacts/model/default.json')) {
        return jsonResponse(ftmModel)
      }
      return null
    })

    // Mock search API
    addFetchHandler((url) => {
      if (url.includes('api.opensanctions.org/search/')) {
        return jsonResponse(searchResponse)
      }
      return null
    })
  })

  it('displays the main claim headline', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Who is running the world?'
    )
  })

  it('displays the subclaim description', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    expect(
      screen.getByText(/global database of political office-holders/i)
    ).toBeInTheDocument()
  })

  it('renders territory data from the API', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    // Should show countries from the API response (may appear multiple times)
    expect(screen.getAllByText('United States').length).toBeGreaterThan(0)
    expect(screen.getAllByText('United Kingdom').length).toBeGreaterThan(0)
  })

  it('displays regional groupings', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    // Regions appear in both table headers and navigation
    expect(screen.getAllByText('Americas').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Europe').length).toBeGreaterThan(0)
  })
})
