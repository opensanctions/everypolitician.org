import Content from '@/components/Content'
import LayoutFrame from '@/components/layout/LayoutFrame'
import { getPageMetadata, getPageByPath } from '@/lib/pages';
import { notFound } from 'next/navigation';


interface ContentPageProps {
  params: Promise<{ slug: string[] }>
}

function makePath(params: string[]): string {
  const path = params.join('/');
  return `/docs/${path}/`;
}

export async function generateMetadata(props: ContentPageProps) {
  const params = await props.params;
  const page = await getPageByPath(makePath(params.slug));
  return getPageMetadata(page);
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

// export async function generateStaticParams() {
//   const pages = await getSitemapPages()
//   const slugs = pages
//     .filter((p) => p.path.startsWith('/docs/'))
//     .map((c) => ({ slug: c.path.split('/').slice(2).filter(s => s.length > 0) }))
//     .filter((s) => s.slug.length > 0)
//   // console.log("SLUGS", slugs)
//   return slugs;
// }
