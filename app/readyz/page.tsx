
import { MAIN_DATASET } from '@/lib/constants';
import { getCatalogEntriesByScope, getDatasetByName } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function CheckReady() {
    await Promise.all([
        getDatasetByName(MAIN_DATASET),
        getCatalogEntriesByScope(MAIN_DATASET),
    ]);
    return (
        <h2>ok :)</h2>
    )
}
