import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { addFetchHandler } from '../vitest.setup'
import {
  territories,
  pepsDataset,
  searchResponse,
  ftmModel,
  jsonResponse,
} from '../test/fixtures'

import Page from './page'

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
      if (url.includes('data.opensanctions.org/datasets/latest/peps/index.json')) {
        return jsonResponse(pepsDataset)
      }
      if (url.includes('data.opensanctions.org/datasets/latest/default/index.json')) {
        return jsonResponse({ ...pepsDataset, name: 'default', datasets: ['peps'] })
      }
      if (url.includes('data.opensanctions.org/artifacts/model/default.json')) {
        return jsonResponse(ftmModel)
      }
      // Handle any other dataset index.json requests (child datasets)
      const datasetMatch = url.match(/datasets\/latest\/([^/]+)\/index\.json/)
      if (datasetMatch) {
        return jsonResponse(makeSourceDataset(datasetMatch[1]))
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

    // Should show countries from the API response
    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('United Kingdom')).toBeInTheDocument()
  })

  it('displays regional groupings', async () => {
    const PageComponent = await Page()
    render(PageComponent)

    // Regions appear in both table headers and navigation
    expect(screen.getAllByText('Americas').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Europe').length).toBeGreaterThan(0)
  })
})
