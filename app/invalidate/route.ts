import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'
// import { warmUpCache } from '@/lib/warm';

/* Revalidate a tag - doesn't require authentication. */

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')

  if (tag) {
    revalidateTag(tag);
    // await warmUpCache();
    return Response.json({ revalidated: true, tag: tag, now: Date.now() })
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing tag to revalidate',
  })
}