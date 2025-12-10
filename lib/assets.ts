
import { unstable_cache } from 'next/cache'
import queryString from 'query-string';

import { CMS_URL, REVALIDATE_BASE } from './constants';


interface IAssetData {
    data: string;
    contentDisposition: string | null;
    contentType: string | null;
}


export function getAssetUrl(id: string, query: any): string {
  return queryString.stringifyUrl({
    'url': `/assets/${id}/`,
    'query': query,
  });
}



export const getCachedAssetData = unstable_cache(
  async (asset: string, height: string | null, width: string | null, quality: string | null) => {
    const imageUrl = queryString.stringifyUrl({
        'url': `${CMS_URL}/assets/${asset}`,
        'query': { height, width, quality },
      });
    console.log(`Asset: ${imageUrl}`);
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    return {
      data: Buffer.from(buffer).toString('base64'),
      contentType: response.headers.get('content-type'),
      contentDisposition: response.headers.get('content-disposition'),
    };
  },
  ['cached-assets'], { revalidate: REVALIDATE_BASE }
)
