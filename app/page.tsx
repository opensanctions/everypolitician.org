import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import CardTitle from 'react-bootstrap/CardTitle';
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
    <LayoutFrame>
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
      <div style={{ backgroundColor: 'var(--bs-gray-800)' }}>
        <Container className="py-4 text-white">
          <Row>
            <Col className="text-center">
              <p className="fs-5 mb-0">
                Tracking{' '}
                <strong>
                  {totals.politicians.toLocaleString()} politicians
                </strong>{' '}
                in{' '}
                <strong>{totals.positions.toLocaleString()} positions</strong>{' '}
                across{' '}
                <strong>{territoriesCount} countries and territories</strong>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row className="py-5 my-5">
          <Col md={8} className="text-center mx-auto">
            <h2>Political data matters.</h2>
            <p className="lead">
              Understanding who holds power is fundamental to democracy.
              Transparent, accessible data about political office-holders
              enables citizens, journalists, and researchers to hold governments
              accountable.
            </p>
          </Col>
        </Row>
        <Row className="pb-5 mb-5">
          <Col md={4} className="mb-4 mb-md-0">
            <h4>
              <a href="https://opensanctions.org/">OpenSanctions</a> ❤️ Open
              Data
            </h4>
            <p className="mb-0">
              We are maintaining this resource to help journalists and
              researchers study who holds power.
            </p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h4>
              Built on <a href="https://www.wikidata.org/">Wikidata</a>
            </h4>
            <p className="mb-0">
              Our goal is to commodotize political data, we can only reach that
              goal together.
            </p>
          </Col>
          <Col md={4}>
            <h4>What&apos;s a politician?</h4>
            <p className="mb-0">
              Anyone holding public authority: presidents, legislators, judges,
              senior officials, and military commanders.
            </p>
          </Col>
        </Row>
      </Container>
      <div className="bg-ep-accent">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col md={8}>
              <h3 className="mt-0">Contribute to political research</h3>
              <p>
                Help us (<a href="https://opensanctions.org/">OpenSanctions</a>)
                commodotize political data to further research into who holds
                power. By contributing to open data you enable journalists and
                researchers to study power networks.
              </p>
              <p className="mb-0">
                Contributing is easy.{' '}
                <a href="/docs/contribute">Learn how you can help.</a>
              </p>
            </Col>
            <Col md={4}>
              <Card>
                <CardBody>
                  <CardTitle>Built on Wikidata</CardTitle>
                  <p>
                    Wikidata is a free knowledge base that anyone can edit.{' '}
                    <a href="https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician">
                      Join the WikiProject
                    </a>
                    .
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutFrame>
  );
}
