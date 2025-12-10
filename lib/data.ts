import 'server-only';
import intersection from 'lodash/intersection';
import queryString from 'query-string';

import { API_TOKEN, API_URL, BLOCKED_ENTITIES, MAIN_DATASET, OSA_URL, REVALIDATE_BASE } from "./constants";
import { Entity, IEntityDatum, Model, Property } from "./ftm";
import { getModel } from './model';
import { getTerritoriesByCode } from './territory';
import { IDataset, IPropResults, IPropResultsData, IPropsResults, IPropsResultsData, isCollection } from "./types";


export async function fetchStatic<T>(url: string, revalidate: number = REVALIDATE_BASE): Promise<T | null> {
  /* Fetch a static JSON file from data.opensanctions.org. */
  const options: any = {
    cache: 'force-cache',
    next: { tags: ['data'], revalidate: revalidate },
    keepalive: true
  };
  // const internalUrl = url.replace('//data.opensanctions.org/', '//storage.googleapis.com/data.opensanctions.org/');
  // console.log("Fetching static", url, options)
  // nb removed try/catch here to avoid swallowing errors and having an ambiguity over files
  // that don't exist vs. ones that cannot be fetched successfully.
  const data = await fetch(url, { ...options });
  if (!data.ok) {
    console.error("Error fetching static data", url, data.statusText);
    return null;
  }
  const body = await data.json();
  return body as T;
}

async function fetchApi<T>(path: string, query: any = undefined, accessToken: string | null = null, options: RequestInit = {}): Promise<T> {
  const authz = accessToken === null ? `ApiKey ${API_TOKEN}` : `Token ${accessToken}`;
  const apiUrl = queryString.stringifyUrl({
    'url': `${API_URL}${path}`,
    'query': query
  });
  const headers = { 'Authorization': authz };
  // console.log("Fetching API", apiUrl, options)
  try {
    const data = await fetch(apiUrl, { keepalive: true, ...options, headers });
    if (!data.ok) {
      throw Error(`Backend error [${apiUrl}]: ${data.statusText}`);
    }
    return await data.json() as T;
  } catch (e) {
    throw Error(`API fetch [${apiUrl}]: ${e}`);
  }
}

export async function fetchApiCached<T>(path: string, query: any = undefined, accessToken: string | null = null): Promise<T> {
  const options: any = {
    cache: 'force-cache',
    next: {
      tags: ['data'],
      revalidate: REVALIDATE_BASE
    }
  };
  return await fetchApi(path, query, accessToken, options);
}



interface ICatalogDataset {
  name: string
  type: string
  title: string
  url?: string
  summary: string
  hidden: boolean
  last_change?: string
  last_export?: string
  thing_count?: number
  datasets?: string[]
  resources?: Array<{ url: string; timestamp: string; mime_type: string; title: string }>
  coverage?: { start?: string; frequency?: string }
  publisher?: {
    url?: string
    name: string
    acronym?: string
    description?: string
    official: boolean
    country?: string
    country_label?: string
  }
}

interface ICatalog {
  datasets: ICatalogDataset[]
}

function getCatalogUrl(scope: string): string {
  return `https://data.opensanctions.org/datasets/latest/${scope}/catalog.json`;
}

async function parseCatalog(scope: string): Promise<IDataset[]> {
  const catalogUrl = getCatalogUrl(scope);
  const catalog = await fetchStatic<ICatalog>(catalogUrl);
  if (catalog === null) {
    throw Error("Catalog not found: " + scope);
  }
  const territories = await getTerritoriesByCode();

  return catalog.datasets.map((d): IDataset => {
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
      publisher: d.publisher ? {
        ...d.publisher,
        territory: d.publisher.country ? territories.get(d.publisher.country) : undefined
      } : undefined,
    };
    return dataset;
  }).sort((a, b) => a.title.localeCompare(b.title));
}

export async function getDatasets(): Promise<IDataset[]> {
  return parseCatalog(MAIN_DATASET);
}

export async function getDatasetsByScope(scope: string): Promise<IDataset[]> {
  return parseCatalog(scope);
}

export async function getDatasetByName(name: string): Promise<IDataset | undefined> {
  const datasets = await getDatasets();
  return datasets.find((d) => d.name === name);
}

export async function getDatasetsByNames(names: string[]): Promise<IDataset[]> {
  const datasets = await getDatasets();
  return names
    .map((name) => datasets.find((d) => d.name === name))
    .filter((d): d is IDataset => d !== undefined);
}

async function getEntityData(entityId: any): Promise<IEntityDatum | null> {
  if (entityId === undefined || entityId === null) {
    return null;
  }
  try {
    const raw = await fetchApiCached<IEntityDatum>(`/entities/${entityId}`, { nested: false });
    if (raw === undefined || raw === null || raw.id === undefined) {
      return null
    }
    return raw;
  } catch {
    return null;
  }
}

export async function getEntity(entityId: string) {
  const model = await getModel();
  const entityData = await getEntityData(entityId);

  if (entityData === null) {
    return null;
  }
  return model.getEntity(entityData);
}


function unpackAdjacentResults(model: Model, response: IPropResultsData): IPropResults {
  return {
    results: response.results.map((data) => model.getEntity(data)),
    total: response.total,
    limit: response.limit,
    offset: response.offset,
  }
}

export async function getAdjacent(entityId: string): Promise<IPropsResults | null> {
  try {
    const path = `/entities/${entityId}/adjacent`;
    const response = await fetchApiCached<IPropsResultsData>(path);
    if (response === undefined || response === null) {
      return null;
    }
    const model = await getModel();
    const results = {
      entity: model.getEntity(response.entity),
      adjacent: new Map() as Map<Property, IPropResults>,
    }
    for (let propName in response.adjacent) {
      const prop = results.entity.schema.getProperty(propName);
      if (prop === undefined)
        continue;
      let propResults = response.adjacent[propName];
      results.adjacent.set(prop, unpackAdjacentResults(model, propResults));
      for (let adjacent of propResults.results)
        results.entity.setProperty(prop, adjacent);
    }
    return results;
  } catch {
    return null;
  }
}

export async function getEntityDatasets(entity: Entity) {
  const allDatasets = await getDatasets();
  return entity.datasets
    .map((name) => allDatasets.find((d) => d.name === name))
    .filter((d) => d !== undefined) as IDataset[];
}

export function isBlocked(entity: Entity): boolean {
  if (BLOCKED_ENTITIES.indexOf(entity.id) !== -1) {
    return true;
  }
  const joined = intersection(entity.referents, BLOCKED_ENTITIES);
  return joined.length > 0;
}

export function isIndexRelevant(entity: Entity): boolean {
  if (isBlocked(entity)) {
    return false;
  }
  const topics = entity.getProperty('topics');
  // all sanctioned entities
  if (topics.indexOf("sanction") !== -1 || topics.indexOf("sanction.linked") !== -1) {
    return true;
  }
  // other key categories
  if (topics.indexOf("gov.head") !== -1 || topics.indexOf("role.oligarch") !== -1) {
    return true;
  }
  // all interpol entities
  if (entity.datasets.indexOf("interpol_red_notices") !== -1) {
    return true;
  }
  // no crime-related entities
  if (topics.indexOf("crime") !== -1) {
    return false;
  }
  // British disqualified directors who threaten to sue us for saying they are "sanctioned"
  // are too much of a time sink.
  if (entity.datasets.length == 1 && entity.datasets[0] === "gb_coh_disqualified") {
    return false;
  }
  // non-human things are more OK re privacy
  if (['Company', 'Organization', 'Vessel', 'Airplane'].indexOf(entity.schema.name) !== -1) {
    return true;
  }
  // default: no
  return false;
}
