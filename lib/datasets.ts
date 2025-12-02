import { OSA_URL } from "./constants";
import { fetchStatic, getDatasets } from "./data";
import { ITerritoryInfo } from "./territory";
import { ICollection, IDataset, IExternal, isCollection, ISource } from "./types";


export interface IAggregatedCountry {
  code: string
  count: number
  label: string
}

export interface IAggregatedSchema {
  name: string
  count: number
  label: string
  plural: string
}

export interface IAggregatedStats {
  total: number
  countries: Array<IAggregatedCountry>
  schemata: Array<IAggregatedSchema>
}

export interface IDatasetStatistics {
  targets: IAggregatedStats
  things: IAggregatedStats
  properties: string[]
  schemata: string[]
}

export function parseDataset(data: any, territories: Map<string, ITerritoryInfo>): IDataset {
  const {
    sources,
    externals,
    ...keep
  } = data;
  const thingCount = (data.thing_count || 0) + (data.things?.total || 0);
  const dataset = {
    ...keep,
    link: `${OSA_URL}/datasets/${data.name}/`,
    issue_count: data.issue_count || 0,
    issue_levels: data.issue_levels || {},
    thing_count: thingCount,
  };
  if (dataset.publisher?.country && territories.has(dataset.publisher.country)) {
    dataset.publisher.territory = territories.get(dataset.publisher.country);
  }
  if (dataset.type === 'collection') {
    return dataset as ICollection;
  }
  if (dataset.type === 'external') {
    return dataset as IExternal;
  }
  return dataset as ISource;
}

export async function getDatasetCount(): Promise<number> {
  const datasets = await getDatasets();
  return datasets.filter((d) => !isCollection(d) && !d.hidden).length;
}

export async function getDatasetStatistics(dataset: IDataset): Promise<IDatasetStatistics> {
  const empty = { things: { total: 0, countries: [], schemata: [] }, targets: { total: 0, countries: [], schemata: [] }, properties: [], schemata: [] };
  const url = dataset.statistics_url || `https://data.opensanctions.org/datasets/latest/${dataset.name}/statistics.json`;
  const statistics = await fetchStatic<IDatasetStatistics>(url);
  if (statistics === null) {
    console.error("Could not load dataset statistics: " + dataset.name);
    return empty;
  }
  return statistics;
}
