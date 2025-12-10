import { CMS_URL, REVALIDATE_LONG } from '@/lib/constants';

export const dynamicParams = true

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const url = new URL(request.url);
    const assetId = (await params).id;
    const height = url.searchParams.get('height');
    const width = url.searchParams.get('width');
    const quality = url.searchParams.get('quality');

    const imageUrl = new URL(`${CMS_URL}/assets/${assetId}`);
    if (height) imageUrl.searchParams.set('height', height);
    if (width) imageUrl.searchParams.set('width', width);
    if (quality) imageUrl.searchParams.set('quality', quality);

    const response = await fetch(imageUrl, {
        next: { revalidate: REVALIDATE_LONG }
    });
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
        headers: {
            'Cache-Control': `public, max-age=${REVALIDATE_LONG}, stale-while-revalidate`,
            'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
            ...(response.headers.get('content-disposition') && {
                'Content-Disposition': response.headers.get('content-disposition')!
            })
        }
    });
}
