import { notFound } from 'next/navigation';

import LayoutFrame from '@/components/layout/LayoutFrame';
import { Menu } from '@/components/Menu';
import { getPageByPath, getPathMetadata } from '@/lib/pages';
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
      <Container className="pt-3">
        <Row>
          <Col md={9} className="order-1 order-md-2">
            {page.body && (
              <div dangerouslySetInnerHTML={{ __html: page.body }} />
            )}
          </Col>
          <Col md={3} className="order-2 order-md-1 pt-5">
            <Menu
              items={[
                { href: '/docs/', label: 'Overview' },
                { href: '/docs/contribute/', label: 'Contribute' },
                { href: '/docs/methodology/', label: 'Methodology' },
                {
                  href: '/docs/opensource/',
                  label: 'Open source',
                  children: [
                    {
                      href: 'https://yente.followthemoney.tech',
                      label: 'yente',
                      external: true,
                    },
                    {
                      href: 'https://followthemoney.tech',
                      label: 'followthemoney',
                      external: true,
                    },
                    {
                      href: 'https://zavod.opensanctions.org',
                      label: 'zavod',
                      external: true,
                    },
                    {
                      href: '/docs/opensource/contributing',
                      label: 'Contributing',
                    },
                    {
                      href: '/docs/opensource/pairs/',
                      label: 'Matcher training data',
                    },
                  ],
                },
              ]}
              current={page.menu_path}
              showLicense
            />
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  );
}
