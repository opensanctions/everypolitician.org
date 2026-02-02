import { MetadataRoute } from 'next';

import { BASE_URL } from '@/lib/constants';
import { getTerritories } from '@/lib/data';
import { positionSections } from '@/lib/positionSections';

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
  const territories = await getTerritories();
  const territoriesMap = territories.flatMap((t) =>
    positionSections.map((s) => ({
      url: `${BASE_URL}/territories/${t.code}/${s.name}/`,
      priority: 0.2,
    })),
  );
  return [...baseMap, ...aboutMap, ...territoriesMap];
}
