import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import Row from 'react-bootstrap/Row';
import Section from '@/components/layout/Section';
import Table from 'react-bootstrap/Table';
import { HelpLink } from '@/components/HelpLink';
import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import ContributeSection from '@/components/ContributeSection';
import { MAIN_DATASET } from '@/lib/constants';
import {
  fetchApi,
  getCountryPEPData,
  getTerritorySummaries,
  getTerritories,
  PositionSummary,
} from '@/lib/data';
import {
  positionSections,
  groupPositions,
  isSectionEmpty,
  caseInsensitiveAlphabetic,
  reverseNumericAlphabetic,
  PositionSectionDefinition,
} from '@/lib/positionSections';

const slugCountryCode = (slug: string) => slug.split('.')[0];

const GOVDIRECTORY_SLUGS: Record<string, string> = {
  Q16: 'canada',
  Q17: 'japan',
  Q20: 'norway',
  Q22: 'united-kingdom/scotland',
  Q27: 'ireland',
  Q30: 'united-states',
  Q31: 'belgium',
  Q32: 'luxembourg',
  Q33: 'finland',
  Q34: 'sweden',
  Q35: 'denmark',
  Q39: 'switzerland',
  Q40: 'austria',
  Q45: 'portugal',
  Q55: 'netherlands',
  Q77: 'uruguay',
  Q117: 'ghana',
  Q145: 'united-kingdom',
  Q159: 'russia',
  Q183: 'germany',
  Q189: 'iceland',
  Q211: 'latvia',
  Q212: 'ukraine',
  Q213: 'czech-republic',
  Q219: 'bulgaria',
  Q223: 'greenland',
  Q229: 'cyprus',
  Q233: 'malta',
  Q241: 'cuba',
  Q252: 'indonesia',
  Q258: 'south-africa',
  Q298: 'chile',
  Q334: 'singapore',
  Q419: 'peru',
  Q458: 'european-union',
  Q574: 'east-timor',
  Q664: 'new-zealand',
  Q668: 'india',
  Q833: 'malaysia',
  Q837: 'nepal',
  Q902: 'bangladesh',
  Q928: 'philippines',
  Q1009: 'cameroon',
  Q1028: 'morocco',
  Q1050: 'eswatini',
  Q1384: 'united-states/new-york',
  Q1454: 'united-states/north-carolina',
  Q23635: 'bermuda',
};

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
  const territories = await getTerritories();
  const territory = territories.find((t) => t.code === countryCode);
  if (!territory) {
    return {};
  }
  return {
    title: `${section.label} in ${territory.name}`,
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

  const territories = await getTerritories();
  const territory = territories.find((t) => t.code === countryCode);
  if (!territory) {
    notFound();
  }

  const [countryPEPSummary, searchResponse, territorySummaries] =
    await Promise.all([
      getCountryPEPData(countryCode),
      fetchApi<any>(`/search/${MAIN_DATASET}`, {
        limit: 0,
        schema: 'Person',
        countries: countryCode,
        facets: ['schema', 'topics'],
      }),
      getTerritorySummaries(),
    ]);

  const positions: PositionSummary[] = countryPEPSummary.positions ?? [];
  positions.sort(caseInsensitiveAlphabetic);
  const categoryResults = groupPositions(positions);
  categoryResults['other']?.sort(reverseNumericAlphabetic);

  const pepFacets = searchResponse.facets.topics.values.filter(
    (topic: any) => topic.name == 'role.pep',
  );
  const pepCount = pepFacets.length == 1 ? pepFacets[0].count : 0;

  const visibleSections = positionSections.filter(
    (section) => !isSectionEmpty(section, categoryResults),
  );

  const hasPositions = section.subsections.some((subsection) => {
    const subsectionPositions = categoryResults[subsection.name];
    return subsectionPositions && subsectionPositions.length > 0;
  });

  const relatedCodes = [
    ...(territory.parent ? [territory.parent] : []),
    ...(territory.see || []),
    ...(territory.claims || []),
    ...(territory.successors || []),
  ];

  return (
    <LayoutFrame>
      <Hero
        title={territory.full_name || territory.name}
        background={
          <WorldMap
            territories={territorySummaries}
            focusTerritory={territory}
          />
        }
      >
        {relatedCodes.length > 0 && (
          <div className="hero-subtitle">
            See also:{' '}
            {relatedCodes.map((code, idx) => {
              const related = territories.find((t) => t.code === code);
              return (
                <span key={code}>
                  {idx > 0 && ', '}
                  <Link href={`/territories/${code}/national/`}>
                    {related?.name || code}
                  </Link>
                </span>
              );
            })}
          </div>
        )}
      </Hero>

      <Section>
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
          connected with {territory.in_sentence || territory.name}.
        </p>

        <Nav variant="tabs" className="mb-3 mt-4">
          {visibleSections.map((s) => (
            <NavItem key={s.name}>
              <Link
                href={`/territories/${countryCode}/${s.name}/`}
                className={`nav-link ${s.name === sectionName ? 'active' : ''}`}
              >
                {s.navLabel}
              </Link>
            </NavItem>
          ))}
        </Nav>

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
                <tbody key={subsectionDefinition.name}>
                  <tr>
                    <th>{subsectionDefinition.label}</th>
                    <th className="numeric text-end d-none d-md-table-cell">
                      Current
                    </th>
                    <th className="numeric text-end d-none d-md-table-cell">
                      Ended
                    </th>
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
                  {subsectionPositions.map((position) => (
                    <tr key={position.id}>
                      <td>
                        <Link
                          prefetch={false}
                          href={`/positions/${position.id}/`}
                        >
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
            })}
          </Table>
        )}

        <Row className="mt-5">
          <Col md={8}>
            <h4>What do these numbers mean?</h4>
            <p>
              We keep track both of political positions and the individuals who
              occupy those positions over time. Of course, a person can hold a
              position for multiple terms, and multiple people can occupy the
              same position at the same time (e.g. members of parliament).
            </p>
            <p>
              If a person previously held a position, and currently holds the
              same position, they are only counted once and recorded under
              Current. If it is unclear from the source whether they have left
              the position, they will be counted under Unclear.
            </p>
            <h4>How can status be unclear?</h4>
            <p>
              Some of the data sources we rely on indicate both past and present
              holders of political offices. In those cases, a lack of a precise
              end date for a person&apos;s occupancy of a position can mean that{' '}
              <Link href="/about/methodology/#types">
                we don&apos;t know whether they currently hold the position or
                not
              </Link>
              .
            </p>
          </Col>
        </Row>
      </Section>

      <ContributeSection
        heading={`Help improve data for ${territory.name}`}
        description={
          <>
            Our coverage of {territory.name} depends on contributions from
            people like you. Help us build the most comprehensive database of
            political office-holders.
          </>
        }
        cards={[
          {
            title: 'PoliLoom',
            description: `Use our semi-automated tool to enrich Wikidata with politician data for ${territory.name}.`,
            href: `${process.env.NEXT_PUBLIC_POLILOOM_URL}${territory.qid ? `/?countries=${territory.qid}` : ''}`,
            label: `Enrich data for ${territory.name}`,
          },
          {
            title: 'GovDirectory',
            description:
              territory.qid && GOVDIRECTORY_SLUGS[territory.qid]
                ? `Explore the government structure of ${territory.name} and help map out its levels of government.`
                : `GovDirectory aims to map out the governments around the world. Help them add ${territory.name}.`,
            href:
              territory.qid && GOVDIRECTORY_SLUGS[territory.qid]
                ? `https://www.govdirectory.org/${GOVDIRECTORY_SLUGS[territory.qid]}/`
                : 'https://www.wikidata.org/wiki/Wikidata:WikiProject_Govdirectory',
            label:
              territory.qid && GOVDIRECTORY_SLUGS[territory.qid]
                ? `Explore ${territory.in_sentence || territory.name}`
                : `Help mapping ${territory.in_sentence || territory.name}`,
          },
        ]}
      />

      <Section>
        <Row>
          <Col md={8}>
            <h3>Using EveryPolitician data</h3>
            <p>
              Browsing office-holders and positions here is a great way to
              explore political structures, but if you want to use
              EveryPolitician data in your own projects, there are several
              options. You can download PEP data in bulk, access it via API, or
              license it for commercial use.
            </p>
            <p>
              <Link href="/about/#how-it-can-be-used">
                Learn more about accessing and using EveryPolitician data
              </Link>
            </p>
          </Col>
        </Row>
      </Section>
    </LayoutFrame>
  );
}
