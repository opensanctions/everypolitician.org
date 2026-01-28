import 'server-only';

import {
  API_TOKEN,
  API_URL,
  MAIN_DATASET,
  OSA_URL,
  REVALIDATE_BASE,
} from './constants';
import {
  EntityData,
  Dataset,
  PropsResults,
  SearchAPIResponse,
  Territory,
} from './types';
import { CountryData } from '@/components/WorldMap';

export type { Territory };

const TERRITORIES_URL = 'https://data.opensanctions.org/meta/territories.json';

type TerritoriesResponse = {
  territories: Territory[];
};

export async function fetchStatic<T>(
  url: string,
  revalidate: number = REVALIDATE_BASE,
): Promise<T | null> {
  /* Fetch a static JSON file from data.opensanctions.org. */
  const options: any = {
    cache: 'force-cache',
    next: { tags: ['data'], revalidate: revalidate },
    keepalive: true,
  };
  const data = await fetch(url, { ...options });
  if (!data.ok) {
    console.error('Error fetching static data', url, data.statusText);
    return null;
  }
  const body = await data.json();
  return body as T;
}

export async function getTerritories(): Promise<Array<Territory>> {
  const data = await fetchStatic<TerritoriesResponse>(TERRITORIES_URL);
  if (!data) {
    throw new Error('Failed to fetch territories');
  }
  return data.territories.filter((t) => t.is_ftm);
}

export async function fetchApi<T>(
  path: string,
  query: Record<string, any> = {},
): Promise<T> {
  const apiUrl = new URL(`${API_URL}${path}`);
  for (const [key, value] of Object.entries(query)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        apiUrl.searchParams.append(key, String(item));
      }
    } else {
      apiUrl.searchParams.set(key, String(value));
    }
  }
  const response = await fetch(apiUrl, {
    keepalive: true,
    cache: 'force-cache',
    next: { tags: ['api'], revalidate: REVALIDATE_BASE },
    headers: { Authorization: `ApiKey ${API_TOKEN}` },
  });
  if (!response.ok) {
    throw Error(`API error [${apiUrl}]: ${response.statusText}`);
  }
  return (await response.json()) as T;
}

type CatalogDataset = {
  name: string;
  type: string;
  title: string;
  url?: string;
  summary: string;
  hidden: boolean;
  last_change?: string;
  last_export?: string;
  thing_count?: number;
  datasets?: string[];
  resources?: Array<{
    url: string;
    timestamp: string;
    mime_type: string;
    title: string;
  }>;
  coverage?: { start?: string; frequency?: string };
  publisher?: {
    url?: string;
    name: string;
    acronym?: string;
    description?: string;
    official: boolean;
    country?: string;
    country_label?: string;
  };
};

type Catalog = {
  datasets: CatalogDataset[];
};

function getCatalogUrl(scope: string): string {
  return `https://data.opensanctions.org/datasets/latest/${scope}/catalog.json`;
}

async function parseCatalog(scope: string): Promise<Dataset[]> {
  const catalogUrl = getCatalogUrl(scope);
  const catalog = await fetchStatic<Catalog>(catalogUrl);
  if (catalog === null) {
    throw Error('Catalog not found: ' + scope);
  }
  const territories = await getTerritories();
  const territoriesByCode = new Map(territories.map((t) => [t.code, t]));

  return catalog.datasets
    .map((d): Dataset => {
      const dataset: Dataset = {
        name: d.name,
        type: d.type,
        title: d.title,
        link: `${OSA_URL}/datasets/${d.name}/`,
        url: d.url,
        summary: d.summary,
        hidden: d.hidden ?? false,
        last_change: d.last_change,
        last_export: d.last_export,
        thing_count: d.thing_count,
        datasets: d.datasets,
        resources: d.resources,
        coverage: d.coverage,
        publisher: d.publisher
          ? {
              ...d.publisher,
              territory: d.publisher.country
                ? territoriesByCode.get(d.publisher.country)
                : undefined,
            }
          : undefined,
      };
      return dataset;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getDatasets(): Promise<Dataset[]> {
  return parseCatalog(MAIN_DATASET);
}

export async function getDatasetsByScope(scope: string): Promise<Dataset[]> {
  return parseCatalog(scope);
}

export async function getDatasetByName(
  name: string,
): Promise<Dataset | undefined> {
  const datasets = await getDatasets();
  return datasets.find((d) => d.name === name);
}

export async function getDatasetsByNames(names: string[]): Promise<Dataset[]> {
  const datasets = await getDatasets();
  return names
    .map((name) => datasets.find((d) => d.name === name))
    .filter((d): d is Dataset => d !== undefined);
}

export async function getAdjacent(
  entityId: string,
): Promise<PropsResults | null> {
  try {
    const path = `/entities/${entityId}/adjacent`;
    return await fetchApi<PropsResults>(path);
  } catch {
    return null;
  }
}

export async function getEntityDatasets(
  entity: EntityData,
): Promise<Dataset[]> {
  const allDatasets = await getDatasets();
  return entity.datasets
    .map((name) => allDatasets.find((d) => d.name === name))
    .filter((d): d is Dataset => d !== undefined);
}

export async function getMapCountryData(): Promise<[string, CountryData][]> {
  const [territories, pepResponse, positionResponse] = await Promise.all([
    getTerritories(),
    fetchApi<SearchAPIResponse>(`/search/default`, {
      limit: 0,
      topics: 'role.pep',
      facets: ['countries'],
    }),
    fetchApi<SearchAPIResponse>(`/search/default`, {
      limit: 0,
      schema: 'Position',
      facets: ['countries'],
    }),
  ]);

  const territoriesByCode = new Map(territories.map((t) => [t.code, t]));
  const countryDataMap = new Map<string, CountryData>();

  for (const { name: code, count } of positionResponse.facets.countries
    .values) {
    const territory = territoriesByCode.get(code);
    if (!territory) continue;
    countryDataMap.set(code, {
      code,
      label: territory.name,
      numPeps: 0,
      numPositions: count,
    });
  }

  for (const { name: code, count } of pepResponse.facets.countries.values) {
    const data = countryDataMap.get(code);
    if (data) data.numPeps = count;
  }

  return Array.from(countryDataMap.entries());
}

export type TerritorySummary = CountryData & {
  region: string;
  subregion?: string;
};

export async function getTerritorySummaries(): Promise<TerritorySummary[]> {
  const countryDataArray = await getMapCountryData();
  const territories = await getTerritories();
  const territoriesByCode = new Map(territories.map((t) => [t.code, t]));

  const summaries: TerritorySummary[] = [];
  for (const [code, data] of countryDataArray) {
    const territory = territoriesByCode.get(code);
    if (territory?.region) {
      summaries.push({
        ...data,
        region: territory.region,
        subregion: territory.subregion,
      });
    }
  }
  return summaries;
}
