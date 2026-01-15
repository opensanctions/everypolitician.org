import { ITerritoryInfo } from './territory';

// Entity types and helpers

export interface EntityData {
  id: string;
  caption: string;
  schema: string;
  datasets: string[];
  referents: string[];
  target: boolean;
  first_seen?: string;
  last_seen?: string;
  last_change?: string;
  properties?: Record<string, (string | EntityData)[]>;
}

export function getFirst(entity: EntityData, prop: string): string | null {
  const value = entity.properties?.[prop]?.[0];
  return typeof value === 'string' ? value : null;
}

export function getStringProperty(entity: EntityData, prop: string): string[] {
  return (
    entity.properties?.[prop]?.filter(
      (v): v is string => typeof v === 'string',
    ) ?? []
  );
}

export function getEntityProperty(
  entity: EntityData,
  prop: string,
): EntityData[] {
  return (
    entity.properties?.[prop]?.filter(
      (v): v is EntityData => typeof v !== 'string',
    ) ?? []
  );
}

// Dataset types

export interface IResource {
  url: string;
  timestamp: string;
  mime_type: string;
  title: string;
}

export interface IDatasetPublisher {
  url?: string;
  name: string;
  acronym?: string;
  description?: string;
  official: boolean;
  country?: string;
  country_label?: string;
  territory?: ITerritoryInfo;
}

export interface IDatasetCoverage {
  start?: string;
  frequency?: string;
}

export interface IDataset {
  name: string;
  type: string;
  title: string;
  link: string;
  url?: string;
  summary: string;
  hidden: boolean;
  last_change?: string;
  last_export?: string;
  thing_count?: number;
  datasets?: Array<string>;
  resources?: Array<IResource>;
  coverage?: IDatasetCoverage;
  publisher?: IDatasetPublisher;
}

// Search API types

interface ISearchFacetItem {
  name: string;
  label: string;
  count: number;
}

export interface ISearchFacet {
  label: string;
  values: Array<ISearchFacetItem>;
}

interface IResponseTotal {
  value: number;
  relation: string;
}

export interface IPaginatedResponse {
  total: IResponseTotal;
  limit: number;
  offset: number;
}

export interface ISearchAPIResponse extends IPaginatedResponse {
  results: Array<EntityData>;
  facets: { [prop: string]: ISearchFacet };
}

export interface IPropResults extends IPaginatedResponse {
  results: Array<EntityData>;
}

export interface IPropsResults {
  entity: EntityData;
  adjacent: Record<string, IPropResults>;
}
