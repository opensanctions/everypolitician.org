import Link from 'next/link';

import { CollectionOverview } from '@/components/Collection';
import { getDatasetCount } from '@/lib/datasets';
import LayoutFrame from '../components/layout/LayoutFrame';
import { FormattedDate, JSONLink, Numeric, NumericBadge } from '../components/util';
import StructuredData from '../components/utils/StructuredData';
import { Badge, Button, ButtonGroup, Col, Container, Form, FormControl, InputGroup, Row } from '../components/wrapped';
import { BASE_URL, CLAIM, INDEX_URL, MAIN_DATASET, SPACER, SUBCLAIM } from '../lib/constants';
import { getDatasetByName } from '../lib/data';
import { getGenerateMetadata } from '../lib/meta';
import { getSchemaWebSite } from "../lib/schema";

import claimStyles from '../styles/ClaimBanner.module.scss';
import styles from '../styles/Home.module.scss';
import utilStyles from '../styles/util.module.scss';
import { Search } from 'react-bootstrap-icons';


export async function generateMetadata() {
  return getGenerateMetadata({
    title: `OpenSanctions: ${CLAIM}`,
    description: SUBCLAIM,
    canonicalUrl: `${BASE_URL}/`,
    rssUrl: `${BASE_URL}/articles/rss/`,
  })
}

export default async function Page() {
  const mainDataset = await getDatasetByName(MAIN_DATASET);
  if (mainDataset === undefined) {
    throw new Error('Could not load main dataset.')
  }
  const datasetCount = await getDatasetCount();
  return (
    <LayoutFrame>
      <StructuredData data={getSchemaWebSite()} />
      <div className={claimStyles.claimBanner}>
        <Container>
          <Row>
            <Col md={8}>
              <h1 className={claimStyles.claim}>
                {CLAIM}
              </h1>
              <p className={claimStyles.subClaim}>
                {SUBCLAIM}
              </p>
              <div className={styles.search}>
                <Form action="/search/" className="d-print-none">
                  <InputGroup size="lg" className="mb-6">
                    <FormControl
                      type="search"
                      name="q"
                      autoFocus={true}
                      placeholder={`Search people and companies in our database...`}
                      aria-label="Search"
                    />
                    <Button variant="secondary" type="submit">
                      <Search className="bsIcon" />{' '}
                      Search
                    </Button>
                  </InputGroup>
                </Form>
              </div>
              <p className={styles.stats}>
                <NumericBadge value={mainDataset.thing_count} /> entities
                {SPACER}
                <NumericBadge value={datasetCount} />&nbsp;
                <Link href="/datasets/sources/">data sources</Link>
                {SPACER}
                updated{' '}
                <Badge>
                  <FormattedDate date={mainDataset.last_export} />
                </Badge>
                {SPACER}
                <Link href={`/datasets/${MAIN_DATASET}/`}>bulk data</Link>
                {SPACER}
                <Link href="/advancedsearch/">screening tool</Link>
              </p>
            </Col>
            <Col md={4} className="d-none d-md-block">
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row>
          <Col md={4} className={utilStyles.explainer}>
            <h3>People and companies that matter</h3>
            Persons of interest data provides the key that helps analysts find evidence of
            sanctions evasion, money laundering and other criminal activity.
          </Col>
          <Col md={4} className={utilStyles.explainer}>
            <h3>Clean data and transparent process</h3>
            Our open source data pipeline takes on the complex task of building a clean,
            de-duplicated, and <Link href="/reference/">well-understood dataset</Link>.
          </Col>
          <Col md={4} className={utilStyles.explainer}>
            <h3>Sources with global scope</h3>
            We integrate data from <Numeric value={datasetCount} /> global sources, including <Link href="/datasets/sanctions">official sanctions
              lists</Link>, data on <Link href="/pep/">politically exposed persons</Link> and entities
            of criminal interest.
          </Col>
        </Row>
      </Container>
      <div className={styles.commercialBanner}>
        <Container>
          <h2>Use OpenSanctions to manage business risk</h2>
          <Row>
            <Col md={8}>
              <p>
                OpenSanctions is <strong>free for non-commercial users.</strong> Business
                and commercial users must either acquire a data license to use our high-quality
                dataset, or subscribe to our pay-as-you-go API service.
              </p>
            </Col>
            <Col md={4} className="d-print-none text-end">
              <ButtonGroup>
                <Button size="lg" href="/api/" variant="secondary">Use the API</Button>
                <Button size="lg" href="/licensing/" variant="light">License bulk data</Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Link href="/showcase/">
                <img src="https://assets.opensanctions.org/images/showcase/blue/Quantifind.png" alt="Quantifind" className={styles.commercialLogo} />
              </Link>
            </Col>
            <Col md={3}>
              <Link href="/showcase/">
                <img src="https://assets.opensanctions.org/images/showcase/blue/Quantexa.png" alt="Quantexa" className={styles.commercialLogo} />
              </Link>
            </Col>
            <Col md={3}>
              <Link href="/showcase/">
                <img src="https://assets.opensanctions.org/images/showcase/blue/Guernsey2.png" alt="Guernsey FIU" className={styles.commercialLogo} />
              </Link>
            </Col>
            <Col md={3}>
              <Link href="/showcase/">
                <img src="https://assets.opensanctions.org/images/showcase/blue/Chainalysis.png" alt="Chainalysis" className={styles.commercialLogo} />
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <h2 className={styles.sectionTitle}>
          Collections &amp; datasets
          <JSONLink href={INDEX_URL} />
        </h2>
        <CollectionOverview />
      </Container>
    </LayoutFrame>
  )
}
