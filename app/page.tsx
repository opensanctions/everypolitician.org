import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
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
        <Row className="py-5">
          <Col>
            <p className="fs-5 mb-0">
              <span className="ep-accent-bg text-white px-2 py-1">
                <strong>{totals.politicians.toLocaleString()}</strong>{' '}
                politicians
              </span>{' '}
              in{' '}
              <span className="ep-accent-bg text-white px-2 py-1">
                <strong>{totals.positions.toLocaleString()}</strong> positions
              </span>{' '}
              across{' '}
              <span className="ep-accent-bg text-white px-2 py-1">
                <strong>{territoriesCount}</strong> countries and territories
              </span>
            </p>
          </Col>
        </Row>
      </Container>
      <div className="ep-accent-bg py-5 text-white">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h3 className="text-white mt-0">
                Contribute to political research
              </h3>
              <p className="mb-0">
                Help us (
                <a
                  href="https://opensanctions.org/"
                  className="text-white text-decoration-underline"
                >
                  OpenSanctions
                </a>
                ) commodotize political data to further research into who holds
                power. By contributing to open data you enable journalists and
                researchers to study power networks.{' '}
                <a
                  href="/docs/contribute"
                  className="text-white text-decoration-underline"
                >
                  Learn how you can contribute
                </a>
                .
              </p>
            </Col>
            <Col
              md={4}
              className="d-flex align-items-center justify-content-md-end mt-3 mt-md-0"
            >
              <Button
                href="https://loom.everypolitician.org"
                variant="light"
                size="lg"
              >
                Open PoliLoom
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutFrame>
  );
}
