import Link from 'next/link';
import { notFound } from 'next/navigation';

import Container from 'react-bootstrap/Container';
import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import { MAIN_DATASET, SPACER } from '@/lib/constants';
import { fetchApiCached, getMapCountryData } from '@/lib/data';
import { getCountryPEPData, PositionSummary } from '@/lib/peps';
import { getTerritoriesByCode } from '@/lib/territory';
import { SearchAPIResponse } from '@/lib/types';
import {
  positionSections,
  groupPositions,
  isSectionEmpty,
} from './positionDefinitions';
import { SectionNav } from './SectionNav';

const slugCountryCode = (slug: string) => slug.split('.')[0];

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function CountryLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const countryCode = slugCountryCode(slug);
  const territories = await getTerritoriesByCode();
  const info = territories.get(countryCode);
  if (info === undefined) {
    notFound();
  }

  const [countryPEPSummary, searchResponse, countryDataArray] =
    await Promise.all([
      getCountryPEPData(countryCode),
      fetchApiCached<SearchAPIResponse>(`/search/${MAIN_DATASET}`, {
        limit: 0,
        schema: 'Person',
        countries: countryCode,
        facets: ['schema', 'topics'],
      }),
      getMapCountryData(),
    ]);

  const positions: PositionSummary[] = countryPEPSummary.positions ?? [];
  const categoryResults = groupPositions(positions);

  const pepFacets = searchResponse.facets.topics.values.filter(
    (topic) => topic.name == 'role.pep',
  );
  const pepCount = pepFacets.length == 1 ? pepFacets[0].count : 0;

  const visibleSections = positionSections.filter(
    (section) => !isSectionEmpty(section, categoryResults),
  );

  return (
    <LayoutFrame activeSection="research">
      <Hero
        title={info.label_full}
        background={
          <WorldMap countryDataArray={countryDataArray} focusTerritory={info} />
        }
      >
        {info.see.length > 0 && (
          <div className="hero-subtitle">
            See also:{' '}
            {info.see.map(({ related_territories_code: c }, idx) => (
              <span key={c}>
                {idx > 0 && <span className="fw-bolder">{SPACER}</span>}
                <Link href={`/territories/${c}/national/`}>
                  {territories.get(c)?.label_short}
                </Link>
              </span>
            ))}
          </div>
        )}
      </Hero>

      <Container className="py-5">
        <h2 id="peps">Political office-holders</h2>
        <p>
          Our database
          {pepCount == 0 ? (
            <> does not yet contain any politicians </>
          ) : (
            <>
              {' '}
              contains {pepCount.toLocaleString('en-US')}{' '}
              {pepCount === 1 ? 'politician' : 'politicians'}{' '}
            </>
          )}
          connected with {info.in_sentence || info.label_short}.
        </p>

        <SectionNav
          countryCode={countryCode}
          visibleSections={visibleSections}
        />

        {children}

        <div className="mt-4 mb-3">
          <h3>Help improve data for {info.label_short}</h3>
          <p>
            EveryPolitician is a community effort. Contribute data and help us
            track who holds power around the world.
          </p>
        </div>
      </Container>
    </LayoutFrame>
  );
}
