import { MetadataRoute } from 'next';

import { BASE_URL } from '@/lib/constants';
import { getDatasets, getTerritories } from '@/lib/data';

export const dynamic = 'force-static';

const PAGES = ['', 'sources/'];

const ABOUT_PAGES = [
  '/about/',
  '/about/contribute/',
  '/about/contribute/wikidata/',
  '/about/methodology/',
  '/about/opensource/',
  '/about/privacy/',
];

function dateTruncate(date?: string | null) {
  return (date ?? new Date().toISOString()).slice(0, 10);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseMap = PAGES.map((url) => ({
    url: `${BASE_URL}/${url}`,
    lastModified: dateTruncate(null),
  }));
  const aboutMap = ABOUT_PAGES.map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: 'monthly' as const,
  }));
  const allDatasets = await getDatasets();
  const datasets = allDatasets.filter((d) => !d.hidden);
  const datasetMap = datasets.map((d) => ({
    url: `${BASE_URL}/datasets/${d.name}/`,
    changeFrequency: 'daily' as const,
    lastModified: dateTruncate(d.last_export || d.last_change),
  }));
  const territories = await getTerritories();
  const territoriesMap = territories.map((t) => ({
    url: `${BASE_URL}/territories/${t.code}/national/`,
    priority: 0.2,
  }));
  return [...baseMap, ...aboutMap, ...datasetMap, ...territoriesMap];
}
