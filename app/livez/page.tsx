
import { MAIN_DATASET } from '@/lib/constants';
import { getCatalogEntriesByScope, getDatasetsByScope } from '@/lib/data';
import { getTerritories } from '@/lib/territory';

export const dynamic = 'force-dynamic';

export default async function CheckLive() {
  await Promise.all([
    getTerritories(),
    getDatasetsByScope(MAIN_DATASET),
    getCatalogEntriesByScope(MAIN_DATASET),
  ]);
  return (
    <h2>ok :)</h2>
  )
}
