import { notFound } from 'next/navigation';


import Content from '@/components/Content'
import LayoutFrame from '@/components/layout/LayoutFrame'
import { getPageByPath, getPathMetadata } from '@/lib/pages';


interface ContentPageProps {
  params: Promise<{ slug: string[] }>
}

function makePath(params: string[]): string {
  const path = params.join('/');
  return `/docs/${path}/`;
}

export async function generateMetadata(props: ContentPageProps) {
  const params = await props.params;
  return await getPathMetadata(params.slug ? makePath(params.slug) : '/docs/');
}


export default async function Page(props: ContentPageProps) {
  const params = await props.params;
  const page = await getPageByPath(makePath(params.slug));
  if (page === null) {
    notFound()
  }
  return (
    <LayoutFrame activeSection={page.section}>
      <Content.Page content={page} />
    </LayoutFrame>
  )
}
