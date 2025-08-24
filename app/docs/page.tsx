import Content from '@/components/Content'
import LayoutFrame from '@/components/layout/LayoutFrame'
import { getPageMetadata, getPageByPath } from '@/lib/pages';
import { notFound } from 'next/navigation';


export async function generateMetadata() {
  const page = await getPageByPath('/docs/');
  return getPageMetadata(page);
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
