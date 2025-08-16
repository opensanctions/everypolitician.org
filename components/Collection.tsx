
import { getDatasetsByNames } from '@/lib/data';
import Link from 'next/link';
import Dataset from './Dataset';
import { Col, Row } from './wrapped';

const FEATURED_COLLECTIONS = ['default', 'sanctions'];
const EXTRA_COLLECTIONS = ['peps', 'securities', 'maritime', 'kyb', 'crime', 'regulatory', 'debarment'];


export async function CollectionOverview() {
  const featured = await getDatasetsByNames(FEATURED_COLLECTIONS);
  const extra = await getDatasetsByNames(EXTRA_COLLECTIONS);
  return (
    <>
      <Row>
        <Col md={3}>
          <p>
            <strong>Collections</strong> are data
            distributions provided by OpenSanctions that combine entities from
            many sources based on a topic.
            {' '}<Link aria-label="What are collections?" prefetch={false} href="/faq/21/collections/">Learn more...</Link>
          </p>
        </Col>
        <Col md={9}>
          <Row>
            {featured.map((d) => (
              <Col sm={6} key={d.name}>
                <Dataset.Card dataset={d} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <p>
            <strong>Special interest collections</strong> contain selections
            of the data that are more specialised than the default collections.
          </p>
        </Col>
        <Col md={9}>
          <Row>
            <Dataset.Table datasets={extra} country={false} frequency={true} />
          </Row>
        </Col>
      </Row>
    </>
  )
}
