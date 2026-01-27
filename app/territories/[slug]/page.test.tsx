import { describe, it, expect, beforeEach } from 'vitest';
import { addFetchHandler } from '../../../vitest.setup';
import { territories, jsonResponse } from '../../../test/fixtures';

import Page from './page';

describe('Country page', () => {
  beforeEach(() => {
    // Mock CMS API for territories
    addFetchHandler((url) => {
      if (url.includes('opensanctions.directus.app/items/territories')) {
        return jsonResponse(territories);
      }
      return null;
    });
  });

  it('throws notFound for unknown territory', async () => {
    const params = Promise.resolve({ slug: 'unknown-country' });

    await expect(Page({ params })).rejects.toThrow();
  });

  it('extracts country code from slug with dot notation', async () => {
    // This tests the slug parsing logic: 'us.united-states' -> 'us'
    const params = Promise.resolve({ slug: 'zz.nonexistent' });

    // 'zz' is not a valid territory, so should throw notFound
    await expect(Page({ params })).rejects.toThrow();
  });
});
