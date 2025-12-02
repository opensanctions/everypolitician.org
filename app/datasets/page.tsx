import Link from 'next/link';
import { Server } from 'react-bootstrap-icons';

import { CollectionOverview } from '@/components/Collection';
import LayoutFrame from '@/components/layout/LayoutFrame';
import { JSONLink } from '@/components/util';
import { Button, Col, Container, Row } from '@/components/wrapped';
import { INDEX_URL } from '@/lib/constants';
import { getGenerateMetadata } from '@/lib/meta';


// export const revalidate = 3600;


export async function generateMetadata() {
  return getGenerateMetadata({
    title: `Our bulk data distributions`,
    description: `A list of all datasets available for bulk data download and access via the API.`
  })
}


export default async function Page() {
  return (
    <LayoutFrame activeSection="datasets">
      <Container>
        <h1>
          Datasets &amp; data collections
          <JSONLink href={INDEX_URL} />
        </h1>
        <CollectionOverview />
        <Row>
          <Col md={3}>
            <p>
              <strong>Data sources</strong> contain and group entities from a
              particular origin.
            </p>
          </Col>
          <Col md={9}>
            <p>
              <Button variant="secondary" size="lg" href="/datasets/sources/">
                <Server />&nbsp;
                Browse data sources &amp; sanctions programs...
              </Button>
            </p>
            <p className="text-muted">
              Detailed breakdown of all <Link href="/faq/20/datasets/">data sources</Link> used by
              OpenSanctions, including publisher, freshness and topical coverage.
            </p>
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  )
}
