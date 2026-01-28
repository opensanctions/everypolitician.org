import { REVALIDATE_BASE } from './constants';

const TERRITORIES_URL = 'https://data.opensanctions.org/meta/territories.json';

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
};

export async function getTerritories(): Promise<Array<Territory>> {
  const response = await fetch(TERRITORIES_URL, {
    next: { tags: ['territories'], revalidate: REVALIDATE_BASE },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch territories: ${response.status}`);
  }
  const { territories }: { territories: Territory[] } = await response.json();
  return territories.filter((t) => t.is_ftm);
}
