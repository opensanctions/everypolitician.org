import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { addFetchHandler } from '../../vitest.setup'
import { territories, defaultDataset, jsonResponse } from '../../test/fixtures'

import CheckReady from './page'

describe('/readyz health check', () => {
  beforeEach(() => {
    // Mock CMS API for territories (needed by getDatasetByName)
    addFetchHandler((url) => {
      if (url.includes('opensanctions.directus.app/items/territories')) {
        return jsonResponse(territories)
      }
      return null
    })

    // Mock dataset index
    addFetchHandler((url) => {
      if (url.includes('data.opensanctions.org/datasets/latest/default/index.json')) {
        return jsonResponse(defaultDataset)
      }
      return null
    })

    // Mock catalog
    addFetchHandler((url) => {
      if (url.includes('data.opensanctions.org/datasets/latest/default/catalog.json')) {
        return jsonResponse({
          datasets: [
            { name: 'peps', title: 'PEPs', type: 'collection' },
            { name: 'sanctions', title: 'Sanctions', type: 'collection' },
          ],
        })
      }
      return null
    })
  })

  it('renders ok message when data is available', async () => {
    const Page = await CheckReady()
    render(Page)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('ok :)')
  })
})
