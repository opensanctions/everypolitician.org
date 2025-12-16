import 'server-only';

import {
  API_TOKEN,
  API_URL,
  MAIN_DATASET,
  OSA_URL,
  REVALIDATE_BASE,
} from './constants';
import { getTerritoriesByCode } from './territory';
import { EntityData, IDataset, IPropResults, IPropsResults } from './types';

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

async function fetchApi<T>(
  path: string,
  query: Record<string, any> = {},
  accessToken: string | null = null,
  options: RequestInit = {},
): Promise<T> {
  const authz =
    accessToken === null ? `ApiKey ${API_TOKEN}` : `Token ${accessToken}`;
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
  const headers = { Authorization: authz };
  try {
    const data = await fetch(apiUrl, { keepalive: true, ...options, headers });
    if (!data.ok) {
      throw Error(`Backend error [${apiUrl}]: ${data.statusText}`);
    }
    return (await data.json()) as T;
  } catch (e) {
    throw Error(`API fetch [${apiUrl}]: ${e}`);
  }
}

export async function fetchApiCached<T>(
  path: string,
  query: any = undefined,
  accessToken: string | null = null,
): Promise<T> {
  const options: any = {
    cache: 'force-cache',
    next: {
      tags: ['data'],
      revalidate: REVALIDATE_BASE,
    },
  };
  return await fetchApi(path, query, accessToken, options);
}

interface ICatalogDataset {
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
}

interface ICatalog {
  datasets: ICatalogDataset[];
}

function getCatalogUrl(scope: string): string {
  return `https://data.opensanctions.org/datasets/latest/${scope}/catalog.json`;
}

async function parseCatalog(scope: string): Promise<IDataset[]> {
  const catalogUrl = getCatalogUrl(scope);
  const catalog = await fetchStatic<ICatalog>(catalogUrl);
  if (catalog === null) {
    throw Error('Catalog not found: ' + scope);
  }
  const territories = await getTerritoriesByCode();

  return catalog.datasets
    .map((d): IDataset => {
      const dataset: IDataset = {
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
                ? territories.get(d.publisher.country)
                : undefined,
            }
          : undefined,
      };
      return dataset;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getDatasets(): Promise<IDataset[]> {
  return parseCatalog(MAIN_DATASET);
}

export async function getDatasetsByScope(scope: string): Promise<IDataset[]> {
  return parseCatalog(scope);
}

export async function getDatasetByName(
  name: string,
): Promise<IDataset | undefined> {
  const datasets = await getDatasets();
  return datasets.find((d) => d.name === name);
}

export async function getDatasetsByNames(names: string[]): Promise<IDataset[]> {
  const datasets = await getDatasets();
  return names
    .map((name) => datasets.find((d) => d.name === name))
    .filter((d): d is IDataset => d !== undefined);
}

export async function getEntity(entityId: string): Promise<EntityData | null> {
  if (entityId === undefined || entityId === null) {
    return null;
  }
  try {
    const raw = await fetchApiCached<EntityData>(`/entities/${entityId}`, {
      nested: false,
    });
    if (raw === undefined || raw === null || raw.id === undefined) {
      return null;
    }
    return raw;
  } catch {
    return null;
  }
}

interface IPropsResultsData {
  entity: EntityData;
  adjacent: Record<string, IPropResults>;
}

export async function getAdjacent(
  entityId: string,
): Promise<IPropsResults | null> {
  try {
    const path = `/entities/${entityId}/adjacent`;
    const response = await fetchApiCached<IPropsResultsData>(path);
    if (response === undefined || response === null) {
      return null;
    }
    return {
      entity: response.entity,
      adjacent: response.adjacent,
    };
  } catch {
    return null;
  }
}

export async function getEntityDatasets(
  entity: EntityData,
): Promise<IDataset[]> {
  const allDatasets = await getDatasets();
  return entity.datasets
    .map((name) => allDatasets.find((d) => d.name === name))
    .filter((d): d is IDataset => d !== undefined);
}
