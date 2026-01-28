import { Territory } from './territory';

// Entity types and helpers

export type EntityData = {
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
};

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

export type Resource = {
  url: string;
  timestamp: string;
  mime_type: string;
  title: string;
};

export type DatasetPublisher = {
  url?: string;
  name: string;
  acronym?: string;
  description?: string;
  official: boolean;
  country?: string;
  country_label?: string;
  territory?: Territory;
};

export type DatasetCoverage = {
  start?: string;
  frequency?: string;
};

export type Dataset = {
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
  resources?: Array<Resource>;
  coverage?: DatasetCoverage;
  publisher?: DatasetPublisher;
};

// Search API types

type SearchFacetItem = {
  name: string;
  label: string;
  count: number;
};

export type SearchFacet = {
  label: string;
  values: Array<SearchFacetItem>;
};

type ResponseTotal = {
  value: number;
  relation: string;
};

export type PaginatedResponse = {
  total: ResponseTotal;
  limit: number;
  offset: number;
};

export type SearchAPIResponse = PaginatedResponse & {
  results: Array<EntityData>;
  facets: { [prop: string]: SearchFacet };
};

export type PropResults = PaginatedResponse & {
  results: Array<EntityData>;
};

export type PropsResults = {
  entity: EntityData;
  adjacent: Record<string, PropResults>;
};
