import 'server-only';

import { API_URL, MAIN_DATASET, OSA_URL, REVALIDATE_BASE } from './constants';
import {
  Dataset,
  EntityData,
  PEPCounts,
  PositionSummary,
  Territory,
  TerritorySummary,
} from './types';

export type { PEPCounts, PositionSummary, Territory, TerritorySummary };

const TERRITORIES_URL = 'https://data.opensanctions.org/meta/territories.json';

type TerritoriesResponse = {
  territories: Territory[];
};

export async function fetchStatic<T>(
  url: string,
  revalidate: number = REVALIDATE_BASE,
): Promise<T> {
  const response = await fetch(url, {
    cache: 'force-cache',
    next: { tags: ['data'], revalidate },
    keepalive: true,
  });
  if (!response.ok) {
    throw Error(`Static fetch error [${url}]: ${response.statusText}`);
  }
  return (await response.json()) as T;
}

export async function getTerritories(): Promise<Array<Territory>> {
  const data = await fetchStatic<TerritoriesResponse>(TERRITORIES_URL);
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
    headers: { Authorization: `ApiKey ${process.env.API_TOKEN}` },
  });
  if (!response.ok) {
    throw Error(`API error [${apiUrl}]: ${response.statusText}`);
  }
  return (await response.json()) as T;
}

async function parseCatalog(scope: string): Promise<Dataset[]> {
  const catalogUrl = `https://data.opensanctions.org/datasets/latest/${scope}/catalog.json`;
  const catalog = await fetchStatic<{ datasets: any[] }>(catalogUrl);
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

export async function getAdjacent(entityId: string): Promise<any> {
  try {
    const path = `/entities/${entityId}/adjacent`;
    return await fetchApi<any>(path);
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

export async function getTerritorySummaries(): Promise<TerritorySummary[]> {
  const [territories, pepResponse, positionResponse] = await Promise.all([
    getTerritories(),
    fetchApi<any>(`/search/default`, {
      limit: 0,
      topics: 'role.pep',
      facets: ['countries'],
    }),
    fetchApi<any>(`/search/default`, {
      limit: 0,
      schema: 'Position',
      facets: ['countries'],
    }),
  ]);

  const territoriesByCode = new Map(territories.map((t) => [t.code, t]));
  const summaries: TerritorySummary[] = [];

  for (const { name: code, count } of positionResponse.facets.countries
    .values) {
    const territory = territoriesByCode.get(code);
    if (!territory?.region) continue;
    summaries.push({
      code,
      label: territory.name,
      numPeps: 0,
      numPositions: count,
      region: territory.region,
      subregion: territory.subregion,
    });
  }

  for (const { name: code, count } of pepResponse.facets.countries.values) {
    const summary = summaries.find((s) => s.code === code);
    if (summary) summary.numPeps = count;
  }

  return summaries;
}

type CountryPEPData = {
  label: string;
  counts: PEPCounts;
  positions: Array<PositionSummary>;
};

export async function getCountryPEPData(
  countryCode: string,
): Promise<CountryPEPData> {
  const url = `https://data.opensanctions.org/meta/peps/countries/${countryCode}.json`;
  const empty: CountryPEPData = {
    label: countryCode,
    counts: { current: 0, ended: 0, unknown: 0, total: 0 },
    positions: [],
  };
  try {
    return await fetchStatic<CountryPEPData>(url);
  } catch {
    return empty;
  }
}

export async function getPersonsWithOccupanciesFromDataset(
  datasetName: string,
  limit: number = 5,
): Promise<any[]> {
  const response = await fetchApi<any>('/search/default', {
    datasets: datasetName,
    schema: 'Person',
    limit,
  });

  const results = await Promise.all(
    response.results.map((person: EntityData) => getAdjacent(person.id)),
  );

  return results.filter((p) => p !== null);
}
