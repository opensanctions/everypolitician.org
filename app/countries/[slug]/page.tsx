import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Plural, SpacedList, Sticky } from '@/components/Formatting';
import { HelpLink } from '@/components/HelpLink';
import LayoutFrame from '@/components/layout/LayoutFrame';
import { PositionSubsection } from './PositionSubsection';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { BASE_URL, MAIN_DATASET } from '@/lib/constants';
import { fetchApiCached } from '@/lib/data';
import { getGenerateMetadata } from '@/lib/meta';
import { getCountryPEPData, IPositionSummary } from '@/lib/peps';
import { getTerritoriesByCode, getTerritoryInfo } from '@/lib/territory';
import { ISearchAPIResponse } from '@/lib/types';

import type { JSX } from 'react';

// export const dynamic = 'force-static';
const HARD_LIMIT = 2000;

const slugCountryCode = (slug: string) => slug.split('.')[0];

type PositionSubsectionDefinition = {
  name: string;
  label: string;
};

type PositionSectionDefinition = {
  name: string;
  label: string;
  navLabel: string;
  subsections: PositionSubsectionDefinition[];
  showIfEmpty: boolean;
};

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const countryCode = slugCountryCode(params.slug);
  const info = await getTerritoryInfo(countryCode);
  if (info === null) {
    return {};
  }
  return getGenerateMetadata({
    title: `Data available for ${info.in_sentence}`,
    canonicalUrl: `${BASE_URL}/countries/${countryCode}/`,
  });
}

// export async function generateStaticParams() {
//   const territories = await getTerritories()
//   const params = territories
//     .map((t) => ({ slug: t.code }))
//   return params;
// }

const positionSections: PositionSectionDefinition[] = [
  {
    name: 'national',
    label: 'National government positions',
    navLabel: 'National government',
    subsections: [
      { name: 'nat-head', label: 'Head of state or government' },
      { name: 'nat-exec', label: 'National executive branches' },
      { name: 'nat-legis', label: 'National legislative branch' },
      { name: 'nat-judicial', label: 'National judicial branch' },
      { name: 'nat-sec', label: 'National security' },
      { name: 'nat-fin', label: 'Central banking and financial integrity' },
      { name: 'diplo', label: 'Diplomatic roles' },
      { name: 'soe', label: 'State-owned enterprises' },
    ],
    showIfEmpty: true,
  },
  {
    name: 'intergov',
    label: 'Intergovernmental positions',
    navLabel: 'Intergovernmental',
    subsections: [{ name: 'int', label: 'International bodies' }],
    showIfEmpty: false,
  },
  {
    name: 'subnational',
    label: 'Subnational government positions',
    navLabel: 'Subnational government',
    subsections: [
      { name: 'subnat-head', label: 'Subnational head of state or government' },
      { name: 'subnat-exec', label: 'Subnational executive branches' },
      { name: 'subnat-legis', label: 'Subnational legislative branch' },
      { name: 'subnat-judicial', label: 'Subnational judicial branch' },
    ],
    showIfEmpty: true,
  },
  {
    name: 'other',
    label: 'Other positions',
    navLabel: 'Other',
    subsections: [{ name: 'other', label: 'Position' }],
    showIfEmpty: false,
  },
];

/**
 * Adds position summary objects to a group for each category for its array
 * of category keys. A position summary can end up in more than one group
 * if they are in more than one category.
 * Positions without categories are added to the `other` category.
 *
 * @param positions
 * @returns Map of category key to array of position summary objects.
 */
function groupPositions(
  positions: IPositionSummary[],
): Map<string, IPositionSummary[]> {
  const categoryResults = new Map();
  positionSections.forEach((section) => {
    section.subsections.forEach((subsection) => {
      categoryResults.set(subsection.name, []);
    });
  });

  positions.forEach((position) => {
    if (position.categories.length == 0) {
      categoryResults.get('other').push(position);
    } else {
      const key = position.categories[0];
      const categoryItems = categoryResults.get(key);
      if (categoryItems == undefined) {
        categoryResults.get('other').push(position);
        console.warn('Unexpected category', key);
      } else {
        categoryItems.push(position);
      }

      // deal with initially not guaranteeing that at most one category
      // gets assigned.
      if (position.categories.length > 1)
        console.warn('More than one category for position', position.id);
    }
  });
  return categoryResults;
}

type PositionSectionProps = {
  sectionDefinition: PositionSectionDefinition;
  categoryResults: Map<string, IPositionSummary[]>;
  allEmpty: boolean;
};

function PositionSection({
  sectionDefinition,
  categoryResults,
  allEmpty,
}: PositionSectionProps) {
  return (
    <Table id={`peps-${sectionDefinition.name}`}>
      <thead>
        <tr>
          <th>
            <h3>{sectionDefinition.label}</h3>
          </th>
          {allEmpty || (
            <th colSpan={3} className="numeric d-none d-md-table-cell">
              Number of known occupants
              <HelpLink href="#explainer" />
            </th>
          )}
        </tr>
      </thead>
      {allEmpty ? (
        <tbody>
          <tr>
            <td colSpan={4}>No positions for this category</td>
          </tr>
        </tbody>
      ) : (
        sectionDefinition.subsections.map((subsectionDefinition) => {
          let positions = categoryResults.get(subsectionDefinition.name);
          if (positions == null) {
            return <></>;
          } else {
            // Send enough positions so it can see if we're over HARD_LIMIT but not more,
            // to be kind to vercel's response body limit and browserkind everywhere.
            positions = positions.slice(0, HARD_LIMIT + 1);
            return (
              <PositionSubsection
                key={subsectionDefinition.name}
                subsectionDefinition={subsectionDefinition}
                positions={positions}
                hardLimit={HARD_LIMIT}
              />
            );
          }
        })
      )}
    </Table>
  );
}

function caseInsensitiveAlphabetic(a: IPositionSummary, b: IPositionSummary) {
  return a.names[0].toLowerCase() > b.names[0].toLowerCase() ? 1 : -1;
}

function reverseNumericAlphabetic(a: IPositionSummary, b: IPositionSummary) {
  if (a.counts.total == b.counts.total) return caseInsensitiveAlphabetic(a, b);
  else return b.counts.total - a.counts.total;
}

function isSectionEmpty(
  section: PositionSectionDefinition,
  categoryResults: Map<string, IPositionSummary[]>,
) {
  return section.subsections.every((subsection) => {
    const positions = categoryResults.get(subsection.name);
    return positions == undefined || positions.length == 0;
  });
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const countryCode = slugCountryCode(params.slug);
  const territories = await getTerritoriesByCode();
  const info = territories.get(countryCode);
  if (info === undefined) {
    notFound();
  }

  // Fetch all data at page level
  const countryPEPSummary = await getCountryPEPData(countryCode);
  const positions: IPositionSummary[] = !!countryPEPSummary.positions
    ? countryPEPSummary.positions
    : [];
  const searchParams = {
    limit: 0,
    schema: 'Person',
    countries: countryCode,
    facets: ['schema', 'topics'],
  };
  const searchResponse = await fetchApiCached<ISearchAPIResponse>(
    `/search/${MAIN_DATASET}`,
    searchParams,
  );

  // Process PEPs data
  positions.sort(caseInsensitiveAlphabetic);
  const categoryResults = groupPositions(positions);
  categoryResults.get('other')?.sort(reverseNumericAlphabetic);

  const pepFacets = searchResponse.facets.topics.values.filter(
    (topic) => topic.name == 'role.pep',
  );
  const pepCount = pepFacets.length == 1 ? pepFacets[0].count : 0;

  return (
    <LayoutFrame activeSection="research">
      <div className="bg-primary">
        <Container>
          <Row>
            <Col md={9}>
              <Row className="align-items-start">
                <Col xs={3}>
                  <img
                    src={`/assets/${info.flag || '10c75c82-b086-4b42-b930-dce7533e1f01'}/?w=150&format=auto`}
                    alt={
                      info.flag
                        ? `Flag of ${info.in_sentence}`
                        : 'Placeholder flag'
                    }
                    className="w-100"
                  />
                </Col>
                <Col xs={9}>
                  <h1>{info.label_full}</h1>
                  <div>
                    {info?.summary || info?.summary}
                    {!info?.summary && info?.wikipedia_url && (
                      <span>
                        {' '}
                        -&nbsp;<Link href={info?.wikipedia_url}>Wikipedia</Link>
                      </span>
                    )}
                  </div>
                  {info.see.length > 0 && (
                    <div>
                      See also:{' '}
                      <SpacedList
                        values={info.see.map((c) => (
                          <Link key={c} href={`/countries/${c}/`}>
                            {territories.get(c)?.label_short}
                          </Link>
                        ))}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          <Col md={9}>
            <Row>
              <h2 id="peps">Politically-exposed persons (PEPs)</h2>
              <p>
                Our database
                {pepCount == 0 ? (
                  <> does not yet contain entities identified as PEPs </>
                ) : (
                  <>
                    {' '}
                    contains{' '}
                    <Plural
                      value={pepCount}
                      one="entity"
                      many="entities"
                    />{' '}
                    identified as PEPs{' '}
                  </>
                )}
                connected with {info.in_sentence}.
              </p>

              {positionSections
                .filter(
                  (section) =>
                    section.showIfEmpty ||
                    !isSectionEmpty(section, categoryResults),
                )
                .map((section) => (
                  <PositionSection
                    key={section.name}
                    sectionDefinition={section}
                    categoryResults={categoryResults}
                    allEmpty={isSectionEmpty(section, categoryResults)}
                  />
                ))}

              <h4 id="explainer">What do these numbers mean?</h4>
              <p>
                We keep track both if political positions and the individuals
                who occupy those positions over time. Of course, a person can
                hold a position for multiple terms, and multiple people can
                occupy the same position at the same time (e.g. members of
                parliament).
              </p>
              <p>
                If a person previously held a position, and currently holds the
                same position, they are only counted once and recorded under
                Current. If it is unclear from the source whether they have left
                the position, they will be counted under Unclear.
              </p>
              <h4 id="explain-status-unclear">How can status be unclear?</h4>
              <p>
                Some of the data sources we rely on indicate both past and
                present holders of political offices. In those cases, a lack of
                a precise end date for a person&apos;s occupancy of a position
                can mean that we don&apos;t know whether they currently hold the
                position or not.{' '}
                <Link href="/docs/pep/methodology/#types">Read more...</Link>
              </p>
            </Row>
          </Col>
          <Col md={3} className="d-none d-md-block">
            <Sticky>
              <Nav className="flex-column d-print-none" variant="pills">
                <NavItem>
                  <NavLink href="#peps">PEPs</NavLink>

                  {positionSections
                    .filter(
                      (section) =>
                        section.showIfEmpty ||
                        !isSectionEmpty(section, categoryResults),
                    )
                    .map((section) => (
                      <NavItem key={section.name}>
                        <NavLink href={`#peps-${section.name}`}>
                          {section.navLabel}
                        </NavLink>
                      </NavItem>
                    ))}
                </NavItem>
              </Nav>
            </Sticky>
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  );
}
