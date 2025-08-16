import { ServerSearchParams } from '@/components/utils/PageProps';
import { MAIN_DATASET, SEARCH_SCHEMA } from './constants';
import { fetchApiCached } from './data';
import { ISearchAPIResponse } from './types';
import { ensureArray } from './util';

const FILTERS = ['q', 'schema', 'schemata', 'topics', 'countries', 'datasets', 'changed_since'];


export async function getResearchStats(): Promise<ISearchAPIResponse> {
  const params = {
    'limit': 0,
    'schema': SEARCH_SCHEMA,
    'facets': ['topics', 'countries', 'schema']
  };
  return await fetchApiCached<ISearchAPIResponse>(`/search/${MAIN_DATASET}`, params);
}


export function hasQuery(searchParams: ServerSearchParams): boolean {
  for (const key of Object.keys(searchParams)) {
    if (FILTERS.includes(key)) {
      const values = ensureArray(searchParams[key]);
      for (const value of values) {
        if (value !== null && value !== undefined && value.trim() !== '') {
          return true;
        }
      }
    }
  }
  return false;
}