import { fetchStatic } from './data';
import { Dataset } from './types';

export type AggregatedCountry = {
  code: string;
  count: number;
  label: string;
};

type AggregatedSchema = {
  name: string;
  count: number;
  label: string;
  plural: string;
};

type AggregatedStats = {
  total: number;
  countries: Array<AggregatedCountry>;
  schemata: Array<AggregatedSchema>;
};

export type DatasetStatistics = {
  targets: AggregatedStats;
  things: AggregatedStats;
  properties: string[];
  schemata: string[];
};

export async function getDatasetStatistics(
  dataset: Dataset,
): Promise<DatasetStatistics> {
  const empty = {
    things: { total: 0, countries: [], schemata: [] },
    targets: { total: 0, countries: [], schemata: [] },
    properties: [],
    schemata: [],
  };
  const url = `https://data.opensanctions.org/datasets/latest/${dataset.name}/statistics.json`;
  const statistics = await fetchStatic<DatasetStatistics>(url);
  if (statistics === null) {
    console.error('Could not load dataset statistics: ' + dataset.name);
    return empty;
  }
  return statistics;
}
