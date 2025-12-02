import { notFound } from 'next/navigation';


import Content from '@/components/Content'
import LayoutFrame from '@/components/layout/LayoutFrame'
import { getPageByPath, getPathMetadata } from '@/lib/pages';


export async function generateMetadata() {
  return await getPathMetadata('/docs/');
}

export default async function Page() {
  const page = await getPageByPath('/docs/');
  if (page === null) {
    notFound()
  }
  return (
    <LayoutFrame activeSection={page.section}>
      <Content.Page content={page} />
    </LayoutFrame>
  )
}
