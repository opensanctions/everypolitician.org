import { describe, it, expect, beforeEach } from 'vitest';
import { addFetchHandler } from '../../../vitest.setup';
import { ftmModel, defaultDataset, jsonResponse } from '../../../test/fixtures';
import { DATA_URL } from '@/lib/constants';

import Page from './page';

const positionEntity = {
  id: 'pos-123',
  caption: 'President of Example',
  schema: 'Position',
  datasets: ['peps'],
  referents: [],
  properties: {
    name: ['President of Example'],
    country: ['us'],
  },
};

// Helper to create a minimal source dataset
function makeSourceDataset(name: string) {
  return {
    name,
    title: name.toUpperCase(),
    type: 'source',
    hidden: false,
    datasets: [],
    publisher: null,
  };
}

describe('Position page', () => {
  beforeEach(() => {
    // Mock model
    addFetchHandler((url) => {
      if (url.includes(`${DATA_URL}/artifacts/model/default.json`)) {
        return jsonResponse(ftmModel);
      }
      return null;
    });

    // Mock datasets
    addFetchHandler((url) => {
      if (url.includes(`${DATA_URL}/datasets/latest/default/index.json`)) {
        return jsonResponse(defaultDataset);
      }
      const datasetMatch = url.match(/datasets\/latest\/([^/]+)\/index\.json/);
      if (datasetMatch) {
        return jsonResponse(makeSourceDataset(datasetMatch[1]));
      }
      return null;
    });
  });

  it('throws notFound when entity does not exist', async () => {
    addFetchHandler((url) => {
      if (url.includes(`${process.env.NEXT_PUBLIC_API_URL}/entities/`)) {
        return jsonResponse(null);
      }
      return null;
    });

    const params = Promise.resolve({ entityId: 'nonexistent' });

    await expect(Page({ params })).rejects.toThrow();
  });

  it('redirects when entity ID differs from requested ID', async () => {
    addFetchHandler((url) => {
      if (
        url.includes(`${process.env.NEXT_PUBLIC_API_URL}/entities/`) &&
        url.includes('/adjacent')
      ) {
        return jsonResponse({
          entity: { ...positionEntity, id: 'pos-456' },
          adjacent: {},
        });
      }
      return null;
    });

    const params = Promise.resolve({ entityId: 'pos-123' });

    await expect(Page({ params })).rejects.toThrow('NEXT_REDIRECT');
  });
});
