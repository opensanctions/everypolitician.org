import { CMS_URL, REVALIDATE_BASE } from './constants';

export type TerritoryInfo = {
  label_short: string;
  label_full: string;
  code: string;
  flag?: string;
  region?: string;
  subregion?: string;
  in_sentence: string;
  date_updated: string;
  date_created: string;
  see: Array<{ related_territories_code: string }>;
};

export async function getTerritories(): Promise<Array<TerritoryInfo>> {
  const url = `${CMS_URL}/items/territories?fields=*,see.*&limit=1000`;
  const response = await fetch(url, {
    next: { tags: ['cms'], revalidate: REVALIDATE_BASE },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch territories: ${response.status}`);
  }
  const { data } = await response.json();
  return data;
}

export async function getTerritoryInfo(
  code: string,
): Promise<TerritoryInfo | null> {
  // Always fetch all because the country page reads the list, too:
  const territories = await getTerritories();
  return territories.find((t) => t.code === code) || null;
}

export async function getTerritoriesByCode(): Promise<
  Map<string, TerritoryInfo>
> {
  const territories = await getTerritories();
  return new Map(territories.map((t) => [t.code, t]));
}
