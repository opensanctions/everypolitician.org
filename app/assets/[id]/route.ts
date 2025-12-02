import { getCachedAssetData } from '@/lib/assets';
import { REVALIDATE_LONG } from '@/lib/constants';

export const dynamicParams = true

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