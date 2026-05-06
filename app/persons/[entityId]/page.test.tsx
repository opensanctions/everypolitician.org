import { describe, it, expect, beforeEach } from 'vitest';
import { addFetchHandler } from '../../../vitest.setup';
import {
  personEntity,
  ftmModel,
  defaultDataset,
  jsonResponse,
} from '../../../test/fixtures';
import { DATA_URL } from '@/lib/constants';

import Page from './page';

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

describe('Person page', () => {
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
          entity: { ...personEntity, id: 'Q456' },
          adjacent: {},
        });
      }
      return null;
    });

    const params = Promise.resolve({ entityId: 'Q123' });

    await expect(Page({ params })).rejects.toThrow('NEXT_REDIRECT');
  });
});
