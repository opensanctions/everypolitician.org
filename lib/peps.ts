import { fetchStatic } from './data';

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

type CountryPEPData = {
  label: string;
  counts: PEPCounts;
  positions: Array<PositionSummary>;
};

export async function getCountryPEPData(
  countryCode: string,
): Promise<CountryPEPData> {
  const url = `https://data.opensanctions.org/meta/peps/countries/${countryCode}.json`;
  const empty = {
    label: countryCode,
    counts: { current: 0, ended: 0, unknown: 0, total: 0 },
    positions: [],
  } as CountryPEPData;
  try {
    const data = await fetchStatic<CountryPEPData>(url);
    if (data === null) {
      return empty;
    }
    return data;
  } catch (e) {
    return empty;
  }
}
