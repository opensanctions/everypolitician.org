import { ContributeBox } from '@/components/ContributeBox';
import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { getMapCountryData } from '@/lib/data';

import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'EveryPolitician: Who is running the world?',
  description:
    'EveryPolitician is a global database of political office-holders, from rulers, law-makers to judges and more.',
  alternates: { canonical: '/' },
};

export default async function Page() {
  const countryDataArray = await getMapCountryData();

  return (
    <LayoutFrame activeSection="research">
      <Hero
        title="Who is running the world?"
        size="large"
        background={<WorldMap countryDataArray={countryDataArray} />}
      >
        <p className="hero-subtitle">
          EveryPolitician is a global database of political office-holders, from
          rulers, law-makers to judges and more.
        </p>
      </Hero>
      <Container className="pt-3">
        <div className="mt-4 mb-3">
          <h3>Help build the dataset</h3>
          <p>
            EveryPolitician is a community effort. Contribute data and help us
            track who holds power around the world.
          </p>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <ContributeBox
                variant="primary"
                title="Enrich Wikidata"
                linkUrl="https://loom.everypolitician.org/"
                linkText="Get started with Poliloom"
              >
                Use Poliloom to add and correct politician data on Wikidata.
                It&apos;s designed to make editing political data
                straightforward, even if you&apos;re new to Wikidata.
              </ContributeBox>
            </Col>
            <Col md={6}>
              <ContributeBox
                variant="secondary"
                title="Add government sources"
                linkUrl="https://www.govdirectory.org/"
                linkText="Contribute to GovDirectory"
              >
                GovDirectory collects links to official government websites.
                Help us find the sources we need to track political offices and
                office-holders.
              </ContributeBox>
            </Col>
          </Row>
        </div>
      </Container>
    </LayoutFrame>
  );
}
