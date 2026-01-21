import { ContributeBox } from '@/components/ContributeBox';
import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import Container from 'react-bootstrap/Container';
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
        <ContributeBox />
      </Container>
    </LayoutFrame>
  );
}
