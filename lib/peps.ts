import { fetchStatic } from './data';
import { IDictionary } from './types';

export interface IPEPCounts {
  current: number
  ended: number
  unknown: number
  total: number
}

export interface IPositionSummary {
  id: string
  names: Array<string>
  categories: Array<string>
  topics: Array<string>
  counts: IPEPCounts
}

export interface ICountryPEPIndex {
  label: string
  counts: IPEPCounts
}

export interface ICountryPEPData extends ICountryPEPIndex {
  positions: Array<IPositionSummary>
}

export interface IPEPIndex {
  countries: IDictionary<ICountryPEPIndex>
}


export async function getCountries(): Promise<IPEPIndex> {
  const index = await fetchStatic<IPEPIndex>("https://data.opensanctions.org/meta/peps/index.json");
  if (index === null) {
    return { countries: {} } as IPEPIndex;
  }
  return index;
}

export async function getCountryPEPData(countryCode: string): Promise<ICountryPEPData> {
  const url = `https://data.opensanctions.org/meta/peps/countries/${countryCode}.json`;
  const empty = { label: countryCode, counts: { current: 0, ended: 0, unknown: 0, total: 0 }, positions: [] } as ICountryPEPData;
  try {
    const data = await fetchStatic<ICountryPEPData>(url);
    if (data === null) {
      return empty;
    }
    return data
  } catch (e) {
    return empty;
  }
}
