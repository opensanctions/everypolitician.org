import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { HelpLink } from '@/components/HelpLink';
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
  caseInsensitiveAlphabetic,
  reverseNumericAlphabetic,
  PositionSectionDefinition,
  PositionSubsectionDefinition,
} from '../positionDefinitions';
import { SectionNav } from '../SectionNav';

const slugCountryCode = (slug: string) => slug.split('.')[0];

const sectionByName = new Map<string, PositionSectionDefinition>(
  positionSections.map((s) => [s.name, s]),
);

export async function generateMetadata(props: {
  params: Promise<{ slug: string; section: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const countryCode = slugCountryCode(params.slug);
  const section = sectionByName.get(params.section);
  if (!section) {
    return {};
  }
  const territories = await getTerritoriesByCode();
  const info = territories.get(countryCode);
  const countryName = info?.label_short ?? countryCode.toUpperCase();
  return {
    title: `${section.label} in ${countryName}`,
    alternates: { canonical: `/territories/${countryCode}/${params.section}/` },
  };
}

function bestLabel(labels: string[]) {
  const isTitlecase = /^[A-Z]\w*/;
  for (const label of labels) {
    if (isTitlecase.exec(label) !== null) return label;
  }
  return labels[0];
}

type PositionSubsectionProps = {
  subsectionDefinition: PositionSubsectionDefinition;
  positions: PositionSummary[];
};

function PositionSubsection({
  subsectionDefinition,
  positions,
}: PositionSubsectionProps) {
  if (positions == null || positions.length === 0) {
    return null;
  }

  return (
    <tbody>
      <tr>
        <th>{subsectionDefinition.label}</th>
        <th className="numeric text-end d-none d-md-table-cell">Current</th>
        <th className="numeric text-end d-none d-md-table-cell">Ended</th>
        <th className="numeric text-end d-none d-md-table-cell text-nowrap">
          <HelpLink
            href="#explain-status-unclear"
            tooltipId="status-unclear"
            tooltip="When we cannot determine whether a person currently holds a position from our data sources with sufficient confidence, we indicate its status as unclear."
          >
            Status unclear
          </HelpLink>
        </th>
      </tr>
      {positions.map((position: PositionSummary) => (
        <tr key={position.id}>
          <td>
            <Link prefetch={false} href={`/positions/${position.id}/`}>
              {bestLabel(position.names)}
            </Link>
          </td>
          <td className="numeric text-end d-none d-md-table-cell">
            {position.counts.current || '-'}
          </td>
          <td className="numeric text-end d-none d-md-table-cell">
            {position.counts.ended || '-'}
          </td>
          <td className="numeric text-end d-none d-md-table-cell">
            {position.counts.unknown || '-'}
          </td>
        </tr>
      ))}
    </tbody>
  );
}

type PageProps = {
  params: Promise<{ slug: string; section: string }>;
};

export default async function SectionPage({ params }: PageProps) {
  const { slug, section: sectionName } = await params;
  const countryCode = slugCountryCode(slug);

  const section = sectionByName.get(sectionName);
  if (!section) {
    notFound();
  }

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
  positions.sort(caseInsensitiveAlphabetic);
  const categoryResults = groupPositions(positions);
  categoryResults['other']?.sort(reverseNumericAlphabetic);

  const pepFacets = searchResponse.facets.topics.values.filter(
    (topic) => topic.name == 'role.pep',
  );
  const pepCount = pepFacets.length == 1 ? pepFacets[0].count : 0;

  const visibleSections = positionSections.filter(
    (section) => !isSectionEmpty(section, categoryResults),
  );

  const hasPositions = section.subsections.some((subsection) => {
    const subsectionPositions = categoryResults[subsection.name];
    return subsectionPositions && subsectionPositions.length > 0;
  });

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

        {!hasPositions ? (
          <p>No {section.label.toLowerCase()} available for this territory.</p>
        ) : (
          <Table>
            {section.subsections.map((subsectionDefinition) => {
              const subsectionPositions =
                categoryResults[subsectionDefinition.name];
              if (!subsectionPositions || subsectionPositions.length === 0) {
                return null;
              }
              return (
                <PositionSubsection
                  key={subsectionDefinition.name}
                  subsectionDefinition={subsectionDefinition}
                  positions={subsectionPositions}
                />
              );
            })}
          </Table>
        )}

        <h4 id="explainer">What do these numbers mean?</h4>
        <p>
          We keep track both if political positions and the individuals who
          occupy those positions over time. Of course, a person can hold a
          position for multiple terms, and multiple people can occupy the same
          position at the same time (e.g. members of parliament).
        </p>
        <p>
          If a person previously held a position, and currently holds the same
          position, they are only counted once and recorded under Current. If it
          is unclear from the source whether they have left the position, they
          will be counted under Unclear.
        </p>
        <h4 id="explain-status-unclear">How can status be unclear?</h4>
        <p>
          Some of the data sources we rely on indicate both past and present
          holders of political offices. In those cases, a lack of a precise end
          date for a person&apos;s occupancy of a position can mean that we
          don&apos;t know whether they currently hold the position or not.{' '}
          <Link href="/docs/methodology/#types">Read more...</Link>
        </p>
      </Container>
    </LayoutFrame>
  );
}
