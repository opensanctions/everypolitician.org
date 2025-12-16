import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Only mock Next.js navigation (system boundary)
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

import Page from './page';
import { notFound } from 'next/navigation';

describe('/docs/[...slug] page', () => {
  it('renders existing documentation page', async () => {
    // Uses real docs/about.md file from the repo
    const params = Promise.resolve({ slug: ['about'] });
    const PageComponent = await Page({ params });
    render(PageComponent);

    // The page body content should be rendered
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('calls notFound when page does not exist', async () => {
    const params = Promise.resolve({ slug: ['nonexistent', 'path'] });

    await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
