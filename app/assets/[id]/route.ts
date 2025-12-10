import { unstable_cache } from 'next/cache'
import queryString from 'query-string';

import { CMS_URL, REVALIDATE_BASE, REVALIDATE_LONG } from '@/lib/constants';

export const dynamicParams = true

const getCachedAssetData = unstable_cache(
    async (asset: string, height: string | null, width: string | null, quality: string | null) => {
        const imageUrl = queryString.stringifyUrl({
            'url': `${CMS_URL}/assets/${asset}`,
            'query': { height, width, quality },
        });
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        return {
            data: Buffer.from(buffer).toString('base64'),
            contentType: response.headers.get('content-type'),
            contentDisposition: response.headers.get('content-disposition'),
        };
    },
    ['cached-assets'], { revalidate: REVALIDATE_BASE }
);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const url = new URL(request.url);
    const assetId = (await params).id;
    const height = url.searchParams.get('height');
    const width = url.searchParams.get('width');
    const quality = url.searchParams.get('quality');
    const asset = await getCachedAssetData(assetId, height, width, quality);
    const init = {
        headers: {
            'Cache-Control': `public, max-age=${REVALIDATE_LONG}, stale-while-revalidate`,
            'Content-Type': asset.contentType || 'application/octet-stream',
            ...(asset.contentDisposition && { 'Content-Disposition': asset.contentDisposition })
        }
    };
    const binaryData = Buffer.from(asset.data, 'base64');
    return new Response(binaryData, init);
}
