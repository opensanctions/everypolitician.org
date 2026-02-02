import { notFound } from 'next/navigation';

import DocsSidebar from '@/components/docs/DocsSidebar';
import LayoutFrame from '@/components/layout/LayoutFrame';
import { getDocsMenu, getPageByPath, getPathMetadata } from '@/lib/pages';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

interface ContentPageProps {
  params: Promise<{ slug?: string[] }>;
}

function makePath(slug?: string[]): string {
  if (!slug || slug.length === 0) return '/about/';
  return `/about/${slug.join('/')}/`;
}

export async function generateMetadata(props: ContentPageProps) {
  const params = await props.params;
  return await getPathMetadata(makePath(params.slug));
}

export default async function Page(props: ContentPageProps) {
  const params = await props.params;
  const [page, menu] = await Promise.all([
    getPageByPath(makePath(params.slug)),
    getDocsMenu(),
  ]);
  if (page === null) {
    notFound();
  }
  return (
    <LayoutFrame>
      <Container className="py-4 mb-5">
        <Row>
          <Col md={9} className="order-1 order-md-2">
            {page.body && (
              <div dangerouslySetInnerHTML={{ __html: page.body }} />
            )}
          </Col>
          <Col md={3} className="order-2 order-md-1 py-2">
            <DocsSidebar menu={menu} activePath={page.menu_path} />
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  );
}
