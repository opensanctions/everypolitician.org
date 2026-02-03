import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { BoxArrowUpRight } from 'react-bootstrap-icons';
import { HelpLink } from '@/components/HelpLink';
import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
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
              We keep track both if political positions and the individuals who
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
      </Container>

      <div className="bg-accent py-5">
        <Container className="my-5">
          <Row>
            <Col md={8}>
              <h3 className="text-white">
                Help improve data for {territory.name}
              </h3>
              <p className="text-white mb-5">
                Our coverage of {territory.name} depends on contributions from
                people like you. Help us build the most comprehensive database
                of political office-holders.
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
                    data for {territory.name}.
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
            <Col md={4}>
              <Card className="h-100 border-0">
                <CardBody className="d-flex flex-column">
                  <h5>GovDirectory</h5>
                  <p className="flex-grow-1">
                    Explore the government structure of {territory.name} and
                    help map out its levels of government.
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
          </Row>
        </Container>
      </div>

      <Container className="py-5">
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
              <Link href="/about/">
                Learn more about accessing and using EveryPolitician data
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  );
}
