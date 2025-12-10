import { fetchStatic } from "./data";
import { IDataset } from "./types";


export interface IAggregatedCountry {
  code: string
  count: number
  label: string
}

interface IAggregatedSchema {
  name: string
  count: number
  label: string
  plural: string
}

interface IAggregatedStats {
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

export async function getDatasetStatistics(dataset: IDataset): Promise<IDatasetStatistics> {
  const empty = { things: { total: 0, countries: [], schemata: [] }, targets: { total: 0, countries: [], schemata: [] }, properties: [], schemata: [] };
  const url = `https://data.opensanctions.org/datasets/latest/${dataset.name}/statistics.json`;
  const statistics = await fetchStatic<IDatasetStatistics>(url);
  if (statistics === null) {
    console.error("Could not load dataset statistics: " + dataset.name);
    return empty;
  }
  return statistics;
}
