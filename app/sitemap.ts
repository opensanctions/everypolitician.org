import { MetadataRoute } from 'next';

import { BASE_URL } from '@/lib/constants';
import { getDatasets } from '@/lib/data';
import { getSitemapPages } from '@/lib/pages';
import { getTerritories } from '@/lib/territory';

export const dynamic = 'force-static';

const PAGES = ['', 'datasets/'];

function dateTruncate(date?: string | null) {
  return (date ?? new Date().toISOString()).slice(0, 10);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // await warmUpCache();

  const baseMap = PAGES.map((url) => ({
    url: `${BASE_URL}/${url}`,
    lastModified: dateTruncate(null),
  }));
  const pages = await getSitemapPages();
  const pagesMap = pages.map((p) => ({
    url: `${BASE_URL}${p.path}`,
    changeFrequency: 'monthly',
    lastModified: dateTruncate(p.date_updated),
  }));
  const allDatasets = await getDatasets();
  const datasets = allDatasets.filter((d) => !d.hidden);
  const datasetMap = datasets.map((d) => ({
    url: `${BASE_URL}/datasets/${d.name}/`,
    changeFrequency: 'daily',
    lastModified: dateTruncate(d.last_export || d.last_change),
  }));
  const territories = await getTerritories();
  const territoriesMap = territories.map((t) => ({
    url: `${BASE_URL}/territories/${t.code}/national/`,
    priority: 0.2,
  }));
  return [...baseMap, ...pagesMap, ...datasetMap, ...territoriesMap];
}
