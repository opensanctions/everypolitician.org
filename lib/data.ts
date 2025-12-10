import 'server-only';
import intersection from 'lodash/intersection';
import { unstable_cache } from 'next/cache';
import queryString from 'query-string';

import { API_TOKEN, API_URL, BLOCKED_ENTITIES, MAIN_DATASET, REVALIDATE_BASE } from "./constants";
import { parseDataset } from "./datasets";
import { Entity, IEntityDatum, Model, Property } from "./ftm";
import { getModel } from './model';
import { getTerritoriesByCode } from './territory';
import { ICatalog, ICatalogEntry, ICollection, IDataset, IPropResults, IPropResultsData, IPropsResults, IPropsResultsData, isCollection, isDataset } from "./types";


const ADJACENT_PAGE_SIZE_SMALL = 10;
const ADJACENT_PAGE_SIZE_LARGE = 100;


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



export function getDatasetLatestPublishedFileUrl(name: string, file_name: string): string {
  return `https://data.opensanctions.org/datasets/latest/${name}/${file_name}`;
}

export async function getDatasetByName(name: string): Promise<IDataset | undefined> {
  const datasetUrl = getDatasetLatestPublishedFileUrl(name, 'index.json');
  const data = await fetchStatic<IDataset>(datasetUrl);
  if (data === null) {
    return undefined;
  }
  const territories = await getTerritoriesByCode();
  return parseDataset(data, territories);
}


function sortDatasetsByTitle(datasets: Array<IDataset | undefined>): Array<IDataset> {
  return datasets.filter(isDataset)
    .sort((a, b) => a.title.localeCompare(b.title));
}


export const getDatasetsByScope: (scope: string) => Promise<Array<IDataset>> = unstable_cache(
  async (scope: string) => {
    const collection = await getDatasetByName(scope);
    if (collection === undefined || !isCollection(collection)) {
      throw Error("Dataset not found (or not a collection): " + scope);
    }
    const territories = await getTerritoriesByCode();
    const datasetDatas = new Array<IDataset>();
    for (let datasetName of collection.datasets) {
      const datasetData = await fetchStatic<IDataset>(getDatasetLatestPublishedFileUrl(datasetName, 'index.json'));
      if (datasetData !== null) {
        datasetDatas.push(datasetData);
      }
    }
    const datasets = datasetDatas.map((d) => parseDataset(d, territories));
    datasets.push(collection);
    return sortDatasetsByTitle(datasets);
  },
  ['scoped-datasets'], { revalidate: REVALIDATE_BASE, tags: ['data'] }
);


export const getCatalogEntriesByScope: (scope: string) => Promise<Array<ICatalogEntry>> = unstable_cache(
  async (scope: string) => {
    const catalogUrl = getDatasetLatestPublishedFileUrl(scope, 'catalog.json');
    const catalog = await fetchStatic<ICatalog>(catalogUrl);
    if (catalog === null) {
      throw Error("Catalog not found: " + scope);
    }
    const datasets: Array<ICatalogEntry> = catalog?.datasets
      .map((d) => { return { name: d.name, title: d.title, type: d.type } as ICatalogEntry })
      .sort((a, b) => a.title.localeCompare(b.title));
    return datasets;
  },
  ['scoped-catalog'], { revalidate: REVALIDATE_BASE, tags: ['data'] }
);


export async function getDatasets(): Promise<Array<IDataset>> {
  return await getDatasetsByScope(MAIN_DATASET);
}

export async function isInCollection(collection: string, source: string): Promise<boolean> {
  if (collection === source) {
    return false;
  }
  const coll = await getDatasetByName(collection);
  if (coll === undefined || !isCollection(coll)) {
    return false;
  }
  return coll.datasets.includes(source);
}

export async function getDatasetsByNames(names: string[]): Promise<Array<IDataset>> {
  const datasets = await Promise.all(names.map((name) => getDatasetByName(name)));
  // return datasets.filter((dataset) => dataset != undefined) as IDataset[];
  //datasetsNamed = names.map((name) => datasets.find((d) => d?.name === name))
  return sortDatasetsByTitle(datasets);
}

export async function getDatasetCollections(dataset: IDataset): Promise<Array<ICollection>> {
  const datasets = await getDatasets();
  return datasets
    .filter(isCollection)
    .filter((c) => c.datasets.indexOf(dataset.name) !== -1)
}

export async function canSearchDataset(dataset: IDataset): Promise<boolean> {
  const scope = await getDatasetByName(MAIN_DATASET);
  if (scope === undefined || !isCollection(scope)) {
    return false;
  }
  const range = isCollection(dataset) ? dataset.datasets : [dataset.name];
  const intersection = range.filter(x => scope.datasets.includes(x));
  return intersection.length == range.length;
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

export async function getAdjacentByProp(entityId: string, propName: string, offset: string) {
  try {
    const path = `/entities/${entityId}/adjacent/${propName}`;
    const params = { limit: ADJACENT_PAGE_SIZE_LARGE, offset };
    const response = await fetchApiCached<IPropResultsData>(path, params);
    if (response === undefined || response === null) {
      return null;
    }
    const model = await getModel();
    return unpackAdjacentResults(model, response);
  } catch {
    return null;
  }
}

export async function getAdjacent(entityId: string): Promise<IPropsResults | null> {
  try {
    const path = `/entities/${entityId}/adjacent`;
    const params = { limit: ADJACENT_PAGE_SIZE_SMALL };
    const response = await fetchApiCached<IPropsResultsData>(path, params);
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
