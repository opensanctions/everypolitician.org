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

  const totals = countryDataArray.reduce(
    (acc, [, data]) => ({
      politicians: acc.politicians + data.numPeps,
      positions: acc.positions + data.numPositions,
    }),
    { politicians: 0, positions: 0 },
  );
  const territoriesCount = countryDataArray.filter(
    ([, data]) => data.numPeps > 0 || data.numPositions > 0,
  ).length;

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
      <Container>
        Tracking <strong>{totals.politicians.toLocaleString()}</strong>{' '}
        politicians &middot;{' '}
        <strong>{totals.positions.toLocaleString()}</strong> positions &middot;{' '}
        <strong>{territoriesCount}</strong> territories
      </Container>
      <Container className="pt-3">
        <div className="mt-4 mb-3">
          <Row>
            <Col md={5} className="mb-4 mb-md-0">
              <h3>Help build the dataset</h3>
              <p>
                Political data should be a public good. We believe that
                information about who holds power&mdash;and when&mdash;should be
                freely available to journalists, researchers, and citizens
                everywhere.
              </p>
              <p>
                At <a href="https://opensanctions.org/">OpenSanctions</a>,
                we&apos;re working to make this a reality by building
                comprehensive, open datasets on politicians worldwide. But we
                can&apos;t do it alone.
              </p>
              <p>
                Whether you have five minutes or five hours, your contributions
                help create a resource that benefits everyone. Join us in
                mapping who runs the world.
              </p>
            </Col>
            <Col md={{ span: 6, offset: 1 }}>
              <ContributeBox
                variant="primary"
                title="Enrich Wikidata"
                linkUrl="https://loom.everypolitician.org/"
                linkText="Get started with Poliloom"
                className="mb-3"
              >
                Use Poliloom to add and correct politician data on Wikidata.
                It&apos;s designed to make editing political data
                straightforward, even if you&apos;re new to Wikidata.
              </ContributeBox>
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
