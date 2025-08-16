import classnames from "classnames";
import Link from "next/link";
import type { JSX } from "react";

import Dataset from "@/components/Dataset";
import Flag from "@/components/Flag";
import LayoutFrame from "@/components/layout/LayoutFrame";
import { PEPSectionDefinition, PEPSubsection } from "@/components/PEPSection";
import { SearchFacet } from "@/components/SearchFacet";
import { HelpLink, Numeric, Plural, SpacedList, Sticky } from "@/components/util";
import { Col, Container, Nav, NavItem, NavLink, Row } from "@/components/wrapped";
import { BASE_URL, MAIN_DATASET } from "@/lib/constants";
import { fetchApiCached, getDatasetByName, getDatasets } from "@/lib/data";
import { getDatasetStatistics } from "@/lib/datasets";
import { getGenerateMetadata } from "@/lib/meta";
import { getCountryPEPData, IPositionSummary } from "@/lib/peps";
import { getTerritoriesByCode, getTerritoryInfo } from "@/lib/territory";
import { IDictionary, ISearchAPIResponse, ISearchFacet } from "@/lib/types";
import styles from '@/styles/Country.module.scss';
import { notFound } from "next/navigation";

// export const dynamic = 'force-static';
const HARD_LIMIT = 2000;

const slugCountryCode = (slug: string) => slug.split(".")[0];

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const countryCode = slugCountryCode(params.slug);
  const info = await getTerritoryInfo(countryCode)
  if (info === null) {
    return {}
  }
  return getGenerateMetadata({
    title: `Data available for ${info.in_sentence}`,
    canonicalUrl: `${BASE_URL}/countries/${countryCode}/`,
  })
}

// export async function generateStaticParams() {
//   const territories = await getTerritories()
//   const params = territories
//     .map((t) => ({ slug: t.code }))
//   return params;
// }


const pepSections: PEPSectionDefinition[] = [
  {
    name: "national",
    label: "National government positions",
    navLabel: "National government",
    subsections: [
      { name: "nat-head", label: "Head of state or government" },
      { name: "nat-exec", label: "National executive branches" },
      { name: "nat-legis", label: "National legislative branch" },
      { name: "nat-judicial", label: "National judicial branch" },
      { name: "nat-sec", label: "National security" },
      { name: "nat-fin", label: "Central banking and financial integrity" },
      { name: "diplo", label: "Diplomatic roles" },
      { name: "soe", label: "State-owned enterprises" },
    ],
    showIfEmpty: true
  },
  {
    name: "intergov",
    label: "Intergovernmental positions",
    navLabel: "Intergovernmental",
    subsections: [
      { name: "int", label: "International bodies" },
    ],
    showIfEmpty: false
  },
  {
    name: "subnational",
    label: "Subnational government positions",
    navLabel: "Subnational government",
    subsections: [
      { name: "subnat-head", label: "Subnational head of state or government" },
      { name: "subnat-exec", label: "Subnational executive branches" },
      { name: "subnat-legis", label: "Subnational legislative branch" },
      { name: "subnat-judicial", label: "Subnational judicial branch" },
    ],
    showIfEmpty: true
  },
  {
    name: "other",
    label: "Other positions",
    navLabel: "Other",
    subsections: [
      { name: "other", label: "Position" },
    ],
    showIfEmpty: false
  }
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
function groupPositions(positions: IPositionSummary[]): Map<string, IPositionSummary[]> {
  const categoryResults = new Map();
  pepSections.forEach((section) => {
    section.subsections.forEach((subsection) => {
      categoryResults.set(subsection.name, []);
    })
  })

  positions.forEach(position => {
    if (position.categories.length == 0) {
      categoryResults.get("other").push(position);
    } else {
      const key = position.categories[0];
      const categoryItems = categoryResults.get(key)
      if (categoryItems == undefined) {
        categoryResults.get("other").push(position);
        console.warn("Unexpected category", key)
      } else {
        categoryItems.push(position);
      }

      // deal with initially not guaranteeing that at most one category
      // gets assigned.
      if (position.categories.length > 1)
        console.warn("More than one category for position", position.id)
    }
  });
  return categoryResults;
}

type PEPSectionProps = {
  sectionDefinition: PEPSectionDefinition
  categoryResults: Map<string, IPositionSummary[]>
  allEmpty: boolean
  countryCode: string
}

function PEPSection({ sectionDefinition, categoryResults, allEmpty, countryCode }: PEPSectionProps) {
  return (
    <table id={`peps-${sectionDefinition.name}`} className={"table table-responsive " + styles.pepTable}>
      <thead>
        <tr>
          <th><h3>{sectionDefinition.label}</h3></th>
          {allEmpty ||
            <th colSpan={3} className="numeric d-none d-md-table-cell">
              Number of known occupants<HelpLink href="#explainer" />
            </th>}
        </tr>
      </thead>
      {
        allEmpty
          ? <tbody><tr><td colSpan={4}>No positions for this category</td></tr></tbody>
          : sectionDefinition.subsections.map((subsectionDefinition) => {
            let positions = categoryResults.get(subsectionDefinition.name)
            if (positions == null) {
              return <></>;
            } else {
              // Send enough positions so it can see if we're over HARD_LIMIT but not more,
              // to be kind to vercel's response body limit and browserkind everywhere.
              positions = positions.slice(0, HARD_LIMIT + 1);
              return <PEPSubsection
                key={subsectionDefinition.name}
                countryCode={countryCode}
                subsectionDefinition={subsectionDefinition}
                positions={positions}
                hardLimit={HARD_LIMIT}
              />
            }
          })
      }
    </table >
  )
}

function caseInsensitiveAlphabetic(a: IPositionSummary, b: IPositionSummary) {
  return a.names[0].toLowerCase() > b.names[0].toLowerCase() ? 1 : -1
}

function reverseNumericAlphabetic(a: IPositionSummary, b: IPositionSummary) {
  if (a.counts.total == b.counts.total)
    return caseInsensitiveAlphabetic(a, b)
  else
    return b.counts.total - a.counts.total
}

function makePEPSections(countryCode: string, positions: IPositionSummary[]): [[string, string][], JSX.Element[]] {
  positions.sort(caseInsensitiveAlphabetic);
  const categoryResults = groupPositions(positions);
  categoryResults.get("other")?.sort(reverseNumericAlphabetic);
  const sections: JSX.Element[] = [];
  const navItems: [string, string][] = [];

  pepSections.forEach((sectionDefinition) => {
    const allEmpty = sectionDefinition.subsections.every((subsection) => {
      const positions = categoryResults.get(subsection.name);
      return positions == undefined || positions.length == 0;
    });
    if (allEmpty && !sectionDefinition.showIfEmpty)
      return;
    sections.push(
      <PEPSection
        key={sectionDefinition.name}
        sectionDefinition={sectionDefinition}
        categoryResults={categoryResults}
        allEmpty={allEmpty}
        countryCode={countryCode}
      />
    );
    navItems.push([sectionDefinition.name, sectionDefinition.navLabel])
  });

  return [navItems, sections];
}

async function EntitiesSection(props: { countryCode: string; countryLabel: string, facets: IDictionary<ISearchFacet> }) {
  const scope = await getDatasetByName(MAIN_DATASET);
  if (scope === undefined) {
    return null;
  }
  const statistics = await getDatasetStatistics(scope);
  const countryThings = statistics.things.countries.filter((c) => c.code == props.countryCode)[0];
  return (<>
    <Row className="mt-4">
      <h2 id="entities">Entities</h2>
      <p>
        Our <Link href="/datasets/default/">standard dataset</Link> contains <Numeric value={countryThings?.count} /> entities
        connected with {props.countryLabel}.
        This may include sanctioned entities, politically-exposed persons (PEPs), and their close associates,
        or entities involved in criminal activity.
      </p>
    </Row>
    <Row>
      <Col md={6} className="mt-4">
        <SearchFacet field="topics" facet={props.facets.topics} searchParams={{ "countries": props.countryCode }} limit={8} />
      </Col>
      <Col md={6} className="mt-4">
        <SearchFacet field="schema" facet={props.facets.schema} searchParams={{ "countries": props.countryCode }} limit={8} />
      </Col>
    </Row>
  </>);
}

async function DatasetsSection(props: { countryCode: string; countryLabel: string }) {
  const allDatasets = await getDatasets()
  const countryDatasets = allDatasets.filter((d) => d.publisher?.country == props.countryCode);
  const datasets = countryDatasets.filter((d) => !d.hidden);

  return (<>
    <Row className="mt-4">
      <h2 id="sources">Data sources</h2>
      <p>
        {datasets.length > 0
          ? <>We include <strong><Plural value={datasets.length} one="data source" many="data sources" /></strong> published by authorities or organizations based in {props.countryLabel}. </>
          : <>We are not yet including any data published by authorities or organizations based in {props.countryLabel}.</>}
        {' '}See our global list of <Link href="/datasets/">data sources</Link> and our <Link href="/docs/criteria/">criteria for selecting datasets</Link>.
      </p>
    </Row>
    <Row>
      {datasets.length > 0 &&
        <Dataset.Table datasets={datasets} country={false} frequency publisher />
      }
    </Row>
  </>)
}

async function PEPsSection(props: { countryCode: string; countryLabel: string, pepCount: number, sections: JSX.Element[] }) {
  const searchUrl = `/search?countries=${props.countryCode}&topics=role.pep`;
  return (<>
    <Row className="mt-4" >
      <h2 id="peps">Politically-exposed persons (PEPs)</h2>
      <p>
        Our database
        {props.pepCount == 0
          ? <> does not yet contain entities identified as PEPs </>
          : <> contains <Link prefetch={false} href={searchUrl}><Plural value={props.pepCount} one="entity" many="entities" /></Link> identified as PEPs </>}
        connected with
        {' '}{props.countryLabel}.
      </p>
    </Row>
    <Row>
      {...props.sections}

      <h4 id="explainer" className="mt-4">What do these numbers mean?</h4>
      <p>
        We keep track both if political positions and the individuals who occupy those
        positions over time. Of course, a person can hold a position for multiple
        terms, and multiple people can occupy the same position at the same time
        (e.g. members of parliament).
      </p>
      <p>
        If a person previously held a position, and currently holds the same position, they
        are only counted once and recorded under Current. If it is unclear from the source
        whether they have left the position, they will be counted under Unclear.
      </p>
      <h4 id="explain-status-unclear" className="mt-4">How can status be unclear?</h4>
      <p>
        Some of the data sources we rely on indicate both past and present holders of political
        offices. In those cases, a lack of a precise end date for a person&apos;s occupancy of a
        position can mean that we don&apos;t know whether they currently hold the position or not.
        {' '}<Link href="/docs/pep/methodology/#types">Read more...</Link>
      </p>
    </Row>
  </>)
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const countryCode = slugCountryCode(params.slug);
  const territories = await getTerritoriesByCode();
  const info = territories.get(countryCode);
  if (info === undefined) {
    notFound()
  }
  const countryPEPSummary = await getCountryPEPData(countryCode);
  const positions: IPositionSummary[] = !!countryPEPSummary.positions ? countryPEPSummary.positions : [];

  const [pepNavItems, pepSections] = makePEPSections(countryCode, positions);
  const searchParams = {
    'limit': 0,
    'schema': "Person",
    'countries': countryCode,
    'facets': ["schema", "topics",]
  };
  const searchResponse = await fetchApiCached<ISearchAPIResponse>(`/search/${MAIN_DATASET}`, searchParams);
  const pepFacets = searchResponse.facets.topics.values.filter((topic) => topic.name == "role.pep");
  const pepCount = pepFacets.length == 1 ? pepFacets[0].count : 0;
  return (
    <LayoutFrame activeSection="research">
      <div className={styles.hero}>
        <Container>
          <Row>
            <Col md={9}>
              <div className={styles.flagContainer}>
                <Flag flag={info.flag} regionLabel={info.in_sentence} />
              </div>
              <div className={styles.headingContainer}>
                <h1 className={styles.title}>
                  {info.label_full}
                </h1>
              </div>
              <div className={styles.content}>
                {info?.summary || info?.summary}
                {(!info?.summary && info?.wikipedia_url) && <span> -&nbsp;<Link href={info?.wikipedia_url}>Wikipedia</Link></span>}
              </div>
              {info.see.length > 0 && (
                <div className={styles.content}>
                  See also: <SpacedList values={info.see.map((c) => <Link key={c} href={`/countries/${c}/`}>{territories.get(c)?.label_short}</Link>)} />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          <Col md={9} >
            <EntitiesSection countryCode={countryCode} countryLabel={info.in_sentence} facets={searchResponse.facets} />
            <DatasetsSection countryCode={countryCode} countryLabel={info.in_sentence} />
            <PEPsSection countryCode={countryCode} countryLabel={info.in_sentence} pepCount={pepCount} sections={pepSections} />
          </Col>
          <Col md={3} className={classnames(styles.nav, "d-none", "d-md-block")}>
            <Sticky>
              <Nav className="flex-column d-print-none" variant="pills">
                <NavLink href="#entities">Entities</NavLink>
                <NavLink href="#sources">Data sources</NavLink>
                <NavLink href="#programs">Programs</NavLink>
                <NavItem>
                  <NavLink href="#peps">PEPs</NavLink>

                  {...pepNavItems.map(([anchor, navLabel]) =>
                    <NavItem key={anchor}>
                      <NavLink href={`#peps-${anchor}`}>{navLabel}</NavLink>
                    </NavItem>
                  )}

                </NavItem>
              </Nav>
            </Sticky>
          </Col>
        </Row>
      </Container>
    </LayoutFrame >
  )
}
