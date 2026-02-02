import { describe, it, expect, vi } from 'vitest';

// Only mock Next.js navigation (system boundary)
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

import Page from './page';
import { notFound } from 'next/navigation';

describe('/docs/[...slug] page', () => {
  it('calls notFound when page does not exist', async () => {
    const params = Promise.resolve({ slug: ['nonexistent', 'path'] });

    await expect(Page({ params })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
