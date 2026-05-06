import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import PoliticianShowcase from './PoliticianShowcase';
import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { HeartFill } from 'react-bootstrap-icons';
import ContributeSection from '@/components/ContributeSection';
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
              Our goal is to commoditize political data, we can only reach that
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
      <ContributeSection
        heading="Contribute to political research"
        description={
          <>
            Help us commoditize political data to further research into who
            holds power. By contributing to open data you enable journalists and
            researchers to study power networks.{' '}
            <a href="/about/contribute/">See all ways in which you can help.</a>
          </>
        }
        cards={[
          {
            title: 'PoliLoom',
            description:
              'Use our semi-automated tool to enrich Wikidata with politician data from the web.',
            href: process.env.NEXT_PUBLIC_POLILOOM_URL!,
            label: 'Start enriching data',
          },
          {
            title: 'GovDirectory',
            description:
              'Help out the project that aims to map out the levels of government around the world.',
            href: 'https://www.govdirectory.org/',
            label: 'Explore government structures',
          },
          {
            title: 'WikiProject',
            description:
              'Join our Wikidata WikiProject to help improve politician data directly in the knowledge base.',
            href: 'https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician',
            label: 'Join the WikiProject',
          },
        ]}
      />
      <PoliticianShowcase persons={showcasePersons} />
    </LayoutFrame>
  );
}
