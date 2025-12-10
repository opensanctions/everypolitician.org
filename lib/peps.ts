import { fetchStatic } from './data';

interface IPEPCounts {
  current: number
  ended: number
  unknown: number
  total: number
}

interface IPositionSummary {
  id: string
  names: Array<string>
  categories: Array<string>
  topics: Array<string>
  counts: IPEPCounts
}

interface ICountryPEPData {
  label: string
  counts: IPEPCounts
  positions: Array<IPositionSummary>
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
