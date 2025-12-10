import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CheckLive from './page'

describe('/livez health check', () => {
  it('renders ok message', async () => {
    const Page = await CheckLive()
    render(Page)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('ok :)')
  })
})
