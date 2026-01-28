// Territory types

export type TerritorySummary = {
  code: string;
  label: string;
  numPeps: number;
  numPositions: number;
  region: string;
  subregion?: string;
};

export type Territory = {
  code: string;
  name: string;
  full_name?: string;
  in_sentence?: string;
  is_ftm: boolean;
  is_country?: boolean;
  region?: string;
  subregion?: string;
  qid?: string;
  parent?: string;
  see?: string[];
  claims?: string[];
  successors?: string[];
};

// Position types

export type PEPCounts = {
  current: number;
  ended: number;
  unknown: number;
  total: number;
};

export type PositionSummary = {
  id: string;
  names: Array<string>;
  categories: Array<string>;
  topics: Array<string>;
  counts: PEPCounts;
};

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
  resources?: Array<{
    url: string;
    timestamp: string;
    mime_type: string;
    title: string;
  }>;
  coverage?: {
    start?: string;
    frequency?: string;
  };
  publisher?: {
    url?: string;
    name: string;
    acronym?: string;
    description?: string;
    official: boolean;
    country?: string;
    country_label?: string;
    territory?: Territory;
  };
};
