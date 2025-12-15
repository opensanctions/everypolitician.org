import { describe, it, expect, beforeEach } from 'vitest';
import { addFetchHandler } from '../../../vitest.setup';
import { binaryResponse } from '../../../test/fixtures';

import { GET } from './route';

describe('/assets/[id] API route', () => {
  beforeEach(() => {
    // Mock CMS asset endpoint
    addFetchHandler((url) => {
      if (url.includes('opensanctions.directus.app/assets/abc123')) {
        return binaryResponse(
          'test-image-data',
          'image/png',
          'inline; filename="test.png"',
        );
      }
      if (url.includes('opensanctions.directus.app/assets/xyz789')) {
        // Response without content-type or disposition headers
        return Promise.resolve(
          new Response(Buffer.from('binary-data'), {
            status: 200,
            headers: {},
          }),
        );
      }
      if (url.includes('opensanctions.directus.app/assets/test-id')) {
        return binaryResponse('data', 'image/jpeg');
      }
      return null;
    });
  });

  it('returns asset data with correct headers', async () => {
    const request = new Request(
      'http://localhost/assets/abc123?height=100&width=200&quality=80',
    );
    const params = Promise.resolve({ id: 'abc123' });

    const response = await GET(request, { params });

    expect(response.headers.get('Content-Type')).toBe('image/png');
    expect(response.headers.get('Content-Disposition')).toBe(
      'inline; filename="test.png"',
    );
    expect(response.headers.get('Cache-Control')).toContain('public');
  });

  it('uses default content type when not provided', async () => {
    const request = new Request('http://localhost/assets/xyz789');
    const params = Promise.resolve({ id: 'xyz789' });

    const response = await GET(request, { params });

    expect(response.headers.get('Content-Type')).toBe(
      'application/octet-stream',
    );
    expect(response.headers.get('Content-Disposition')).toBeNull();
  });

  it('returns correct binary data', async () => {
    const request = new Request('http://localhost/assets/test-id');
    const params = Promise.resolve({ id: 'test-id' });

    const response = await GET(request, { params });
    const body = await response.arrayBuffer();

    expect(Buffer.from(body).toString()).toBe('data');
  });
});
