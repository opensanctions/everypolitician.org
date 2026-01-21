import Link from 'next/link';
import { notFound } from 'next/navigation';

import Container from 'react-bootstrap/Container';
import { ContributeBox } from '@/components/ContributeBox';
import { Plural, SpacedList } from '@/components/Formatting';
import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import { MAIN_DATASET } from '@/lib/constants';
import { fetchApiCached, getMapCountryData } from '@/lib/data';
import { getCountryPEPData, IPositionSummary } from '@/lib/peps';
import { getTerritoriesByCode } from '@/lib/territory';
import { ISearchAPIResponse } from '@/lib/types';
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
      fetchApiCached<ISearchAPIResponse>(`/search/${MAIN_DATASET}`, {
        limit: 0,
        schema: 'Person',
        countries: countryCode,
        facets: ['schema', 'topics'],
      }),
      getMapCountryData(),
    ]);

  const positions: IPositionSummary[] = countryPEPSummary.positions ?? [];
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
            <SpacedList
              values={info.see.map((c) => (
                <Link key={c} href={`/countries/${c}/national/`}>
                  {territories.get(c)?.label_short}
                </Link>
              ))}
            />
          </div>
        )}
      </Hero>

      <Container className="pt-3">
        <h2 id="peps">Political office-holders</h2>
        <p>
          Our database
          {pepCount == 0 ? (
            <> does not yet contain any politicians </>
          ) : (
            <>
              {' '}
              contains{' '}
              <Plural
                value={pepCount}
                one="politician"
                many="politicians"
              />{' '}
            </>
          )}
          connected with {info.in_sentence}.
        </p>

        <SectionNav
          countryCode={countryCode}
          visibleSections={visibleSections}
        />

        {children}

        <ContributeBox countryName={info.label_short} />
      </Container>
    </LayoutFrame>
  );
}
