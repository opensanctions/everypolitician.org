import { readItems } from '@directus/sdk';
import { BASE_URL } from './constants';
import { markdownToHtml } from './util';
import { client, getAssetUrl } from './cms';
import { getGenerateMetadata } from './meta';
import { Metadata } from 'next';


export interface IPageMetadata {
  path: string
  date_created: string
  date_updated: string
}

export interface IPage extends IPageMetadata {
  title: string
  image?: string
  summary: string | null
  section: string
  menu_path: string
  url: string
  no_index: boolean
  body: string
}


export async function getPageByPath(path: string): Promise<IPage | null> {
  const response = await client.request(readItems('pages' as any, {
    fields: ['*'],
    filter: { path: { _eq: path }, status: { _eq: 'published' } }
  }));
  if (response.length !== 1) {
    return null;
  }
  const { body, ...rest } = response[0];
  return {
    ...rest,
    body: await markdownToHtml(body),
    url: `${BASE_URL}${rest.path}`,
    // TODO: use parent for this instead?:
    menu_path: rest.menu_path || rest.path,
    date_updated: rest.date_updated || rest.date_created
  } as IPage;
}


export function getPageMetadata(page: IPage | null): Metadata {
  if (page === null) {
    return {}
  }
  // todo: scaling
  const imageUrl = (!!page.image) ? getAssetUrl(page.image, {}) : null;
  return getGenerateMetadata({
    title: page.title,
    noIndex: page.no_index,
    description: page.summary || undefined,
    canonicalUrl: page.url,
    imageUrl: imageUrl
  })
}

export async function getSitemapPages(limit: number = 5000): Promise<Array<IPageMetadata>> {
  const query = {
    fields: ['path', 'date_created', 'date_updated'],
    sort: ['-date_created'],
    limit: limit,
    filter: {
      status: { _eq: 'published' }, no_index: { _eq: false },
    }
  };
  const response = await client.request(readItems('pages' as any, query));
  return response as any as IPageMetadata[];
}
