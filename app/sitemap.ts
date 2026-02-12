import { MetadataRoute } from 'next';

import { BASE_URL } from '@/lib/constants';
import { getTerritories } from '@/lib/data';
import { positionSections } from '@/lib/positionSections';

export const dynamic = 'force-static';

const PAGES = ['', 'sources/', 'regions/'];

const ABOUT_PAGES = [
  '/about/',
  '/about/contribute/',
  '/about/contribute/wikidata/',
  '/about/methodology/',
  '/about/opensource/',
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
  const regions = Array.from(
    new Set(territories.map((t) => t.region).filter(Boolean)),
  );
  const regionsMap = regions.map((region) => ({
    url: `${BASE_URL}/regions/${region!.toLowerCase()}/`,
  }));
  return [...baseMap, ...aboutMap, ...territoriesMap, ...regionsMap];
}
