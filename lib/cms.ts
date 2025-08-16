import { createDirectus, rest } from '@directus/sdk';
import queryString, { StringifiableRecord } from 'query-string';
import { CMS_URL, REVALIDATE_BASE } from './constants';
import { randomizeCache } from './util';


export interface ItemsResponse {
  data: any[]
}

export const client = createDirectus(CMS_URL, { globals: { fetch: loggingFetch } }).with(rest({
  onRequest: (options: any) => ({
    ...options,
    cache: 'force-cache',
    next: {
      tags: ['cms'],
      revalidate: randomizeCache(REVALIDATE_BASE)
    }
  }),
}));


export async function fetchCms<T>(path: string, params: StringifiableRecord): Promise<T> {
  const url = queryString.stringifyUrl({
    'url': `${CMS_URL}${path}`,
    'query': params,
  });
  const response = await fetch(url, {
    next: {
      tags: ['cms'],
      revalidate: REVALIDATE_BASE
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch CMS data ${url}: ${response.status} ${response.statusText}`);
  }
  const respData = await response.json();
  return respData as T;
}


export function getAssetUrl(id: string, query: any): string {
  return queryString.stringifyUrl({
    'url': `${CMS_URL}/assets/${id}`,
    'query': query,
  });
}


export async function loggingFetch(url: string, options: any) {
  const response = await fetch(url, options);
  if (!response.ok) {
    console.error('Failed to fetch', url, options, response.status, response.statusText, response.headers);
  }
  return new Promise((resolve) => resolve(response));
};
