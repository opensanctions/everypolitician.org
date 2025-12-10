import { getDatasets } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function CheckReady() {
    await getDatasets();
    return (
        <h2>ok :)</h2>
    )
}
