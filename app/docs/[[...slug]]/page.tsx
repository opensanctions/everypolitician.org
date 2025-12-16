import Link from 'next/link';
import { notFound } from 'next/navigation';

import LayoutFrame from '@/components/layout/LayoutFrame';
import { Menu } from '@/components/Menu';
import { getPageByPath, getPathMetadata } from '@/lib/pages';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
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
      <Container>
        <Row>
          <Col md={9} className="order-1 order-md-2">
            {page.body && (
              <div dangerouslySetInnerHTML={{ __html: page.body }} />
            )}
            <Alert variant="primary" className="d-print-none">
              <Button href="/support/">Got questions?</Button> Our support is
              here to help. You can also join the{' '}
              <Link href="https://discuss.opensanctions.org">
                discussion forum
              </Link>{' '}
              to meet the community.
            </Alert>
          </Col>
          <Col md={3} className="order-2 order-md-1">
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
