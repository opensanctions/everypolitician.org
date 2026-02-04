import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import PoliticianShowcase from './PoliticianShowcase';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import { BoxArrowUpRight, HeartFill } from 'react-bootstrap-icons';
import {
  getTerritorySummaries,
  getPersonsWithOccupanciesByIds,
} from '@/lib/data';

import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'EveryPolitician: Who is running the world?',
  description:
    'EveryPolitician is a global database of political office-holders, from rulers, law-makers to judges and more.',
  alternates: { canonical: '/' },
};

export default async function Page() {
  const [territories, showcasePersons] = await Promise.all([
    getTerritorySummaries(),
    getPersonsWithOccupanciesByIds([
      'Q55223040', // Alexandria Ocasio-Cortez
      'Q32024', // Sergei Shoigu
      'Q43723', // Benjamin Netanyahu
      'Q484605', // Christine Lagarde
      'Q1148669', // Cyril Ramaphosa
      'Q548733', // Vajiralongkorn (King of Thailand)
    ]),
  ]);

  const totals = territories.reduce(
    (acc, t) => ({
      politicians: acc.politicians + t.numPeps,
      positions: acc.positions + t.numPositions,
    }),
    { politicians: 0, positions: 0 },
  );
  const territoriesCount = territories.filter(
    (t) => t.numPeps > 0 || t.numPositions > 0,
  ).length;

  return (
    <LayoutFrame>
      <Hero
        title="Who is running the world?"
        size="large"
        background={<WorldMap territories={territories} />}
      >
        <p className="hero-subtitle">
          EveryPolitician is a global database of political office-holders, from
          rulers, law-makers to judges and more.
        </p>
      </Hero>
      <div className="bg-dark">
        <Container>
          <Row className="py-4 text-white">
            <Col className="text-start text-md-center">
              <p className="fs-5 mb-0">
                Tracking{' '}
                <strong>
                  {totals.politicians.toLocaleString()} politicians
                </strong>
                <br className="d-md-none" /> in{' '}
                <strong>{totals.positions.toLocaleString()} positions</strong>
                <br className="d-md-none" /> across{' '}
                <strong>{territoriesCount} countries and territories</strong>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row className="pt-5 pb-0 pb-md-5 my-5">
          <Col md={8} className="text-start text-md-center mx-auto">
            <h2>Political data matters.</h2>
            <p className="lead mb-0 mb-md-3">
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
              <a href="https://opensanctions.org/">OpenSanctions</a>{' '}
              <HeartFill className="text-danger" /> Open Data
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
                <a href="/about/contribute/">
                  See all ways in which you can help.
                </a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3 mb-md-0">
              <Card className="h-100 border-0">
                <CardBody className="d-flex flex-column">
                  <h5>PoliLoom</h5>
                  <p className="flex-grow-1">
                    Use our AI driven tool to enrich Wikidata with politician
                    data from the web.
                  </p>
                  <Button
                    href="https://loom.everypolitician.org/"
                    variant="primary"
                    className="w-100"
                  >
                    Start enriching data <BoxArrowUpRight />
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <Card className="h-100 border-0">
                <CardBody className="d-flex flex-column">
                  <h5>GovDirectory</h5>
                  <p className="flex-grow-1">
                    Help out the project that aims to map out the levels of
                    government around the world.
                  </p>
                  <Button
                    href="https://www.govdirectory.org/"
                    variant="primary"
                    className="w-100"
                  >
                    Explore government structures <BoxArrowUpRight />
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0">
                <CardBody className="d-flex flex-column">
                  <h5>WikiProject</h5>
                  <p className="flex-grow-1">
                    Join our Wikidata WikiProject to help improve politician
                    data directly in the knowledge base.
                  </p>
                  <Button
                    href="https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician"
                    variant="primary"
                    className="w-100"
                  >
                    Join the WikiProject <BoxArrowUpRight />
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <PoliticianShowcase persons={showcasePersons} />
    </LayoutFrame>
  );
}
