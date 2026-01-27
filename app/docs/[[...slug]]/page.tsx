import { notFound } from 'next/navigation';

import LayoutFrame from '@/components/layout/LayoutFrame';
import { getPageByPath, getPathMetadata } from '@/lib/pages';
import Nav from 'react-bootstrap/Nav';
import NavLink from 'react-bootstrap/NavLink';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

interface ContentPageProps {
  params: Promise<{ slug?: string[] }>;
}

function makePath(slug?: string[]): string {
  if (!slug || slug.length === 0) return '/docs/';
  return `/docs/${slug.join('/')}/`;
}

export async function generateMetadata(props: ContentPageProps) {
  const params = await props.params;
  return await getPathMetadata(makePath(params.slug));
}

export default async function Page(props: ContentPageProps) {
  const params = await props.params;
  const page = await getPageByPath(makePath(params.slug));
  if (page === null) {
    notFound();
  }
  return (
    <LayoutFrame activeSection="docs">
      <Container className="py-4 mb-5">
        <Row>
          <Col md={9} className="order-1 order-md-2">
            {page.body && (
              <div dangerouslySetInnerHTML={{ __html: page.body }} />
            )}
          </Col>
          <Col md={3} className="order-2 order-md-1 py-2">
            <Nav
              className="flex-column justify-content-start d-print-none"
              variant="pills"
            >
              <NavLink href="/docs/" active={page.menu_path === '/docs/'}>
                Overview
              </NavLink>
              <NavLink
                href="/docs/contribute/"
                active={page.menu_path === '/docs/contribute/'}
              >
                Contribute
              </NavLink>
              <NavLink
                href="/docs/methodology/"
                active={page.menu_path === '/docs/methodology/'}
              >
                Methodology
              </NavLink>
              <NavLink
                href="/docs/opensource/"
                active={page.menu_path === '/docs/opensource/'}
              >
                Open source
              </NavLink>
            </Nav>
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  );
}
