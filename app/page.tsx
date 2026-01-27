import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import CardTitle from 'react-bootstrap/CardTitle';
import { BoxArrowUpRight } from 'react-bootstrap-icons';
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
        <Container>
          <Row className="py-4 text-white">
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
            <h4>Community project</h4>
            <p className="mb-0">
              This dataset is built by volunteers worldwide. Anyone can help
              improve political data for their country.
            </p>
          </Col>
        </Row>
      </Container>
      <div className="bg-accent py-5">
        <Container className="my-5">
          <Row>
            <Col md={8}>
              <h3>Contribute to political research</h3>
              <p className="mb-5">
                Help us commodotize political data to further research into who
                holds power. By contributing to open data you enable journalists
                and researchers to study power networks.{' '}
                <a href="/docs/contribute">
                  See all ways in which you can help.
                </a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3 mb-md-0">
              <Card className="h-100 border-0">
                <CardBody>
                  <CardTitle>
                    <h5>PoliLoom</h5>
                  </CardTitle>
                  <p>
                    Use our AI driven tool to enrich Wikidata with politician
                    data from the web.
                  </p>
                  <p className="mb-0">
                    <a
                      href="https://loom.everypolitician.org/"
                      className="link-primary"
                    >
                      Start enriching data <BoxArrowUpRight />
                    </a>
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <Card className="h-100 border-0">
                <CardBody>
                  <CardTitle>
                    <h5>GovDirectory</h5>
                  </CardTitle>
                  <p>
                    Help out the project that aims to map out the levels of
                    government around the world.
                  </p>
                  <p className="mb-0">
                    <a
                      href="https://www.govdirectory.org/"
                      className="link-primary"
                    >
                      Explore government structures <BoxArrowUpRight />
                    </a>
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0">
                <CardBody>
                  <CardTitle>
                    <h5>WikiProject</h5>
                  </CardTitle>
                  <p>
                    Join our Wikidata WikiProject to help improve politician
                    data directly in the knowledge base.
                  </p>
                  <p className="mb-0">
                    <a
                      href="https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician"
                      className="link-primary"
                    >
                      Join the WikiProject <BoxArrowUpRight />
                    </a>
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row className="py-5 my-5">
          <Col md={6}>
            <h4>What&apos;s a politician?</h4>
            <p>
              Anyone holding public authority: presidents, legislators, judges,
              senior officials, and military commanders.
            </p>
          </Col>
          <Col md={6}>
            <div className="bg-light rounded p-4 h-100 d-flex align-items-center justify-content-center text-muted">
              <p className="mb-0">
                Example politicians from dataset coming soon
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  );
}
