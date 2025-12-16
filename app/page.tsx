import Link from 'next/link';
import slugify from 'slugify';

import { Numeric, Sticky } from '@/components/Formatting';
import { HelpLink } from '@/components/HelpLink';
import LayoutFrame from '@/components/layout/LayoutFrame';
import { Menu } from '@/components/Menu';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { fetchApiCached } from '@/lib/data';
import { getTerritoriesByCode } from '@/lib/territory';
import { ISearchAPIResponse } from '@/lib/types';

import { getGenerateMetadata } from '@/lib/meta';
import { BASE_URL, CLAIM, SUBCLAIM } from '@/lib/constants';

export const dynamic = 'force-static';

export async function generateMetadata() {
  return getGenerateMetadata({
    title: `EveryPolitican: ${CLAIM}`,
    description: SUBCLAIM,
    canonicalUrl: `${BASE_URL}/`,
  });
}

type TerritorySummary = {
  code: string;
  label: string;
  numPeps: number;
  numPositions: number;
  region: string | undefined;
  subregion: string | undefined;
};

type SubregionProps = {
  label: string;
  territories: TerritorySummary[];
};
function Subregion({ label, territories }: SubregionProps) {
  territories.sort((a, b) => (a.label > b.label ? 1 : -1));
  return (
    <>
      {label !== 'undefined' && (
        <tr>
          <th colSpan={3}>{label}</th>
        </tr>
      )}
      {territories.map((territory) => (
        <tr key={territory.code}>
          <td>
            <Link prefetch={false} href={`/countries/${territory.code}/`}>
              {territory.label}
            </Link>
          </td>
          <td className="numeric">
            <Link prefetch={false} href={`/countries/${territory.code}/#peps`}>
              <Numeric value={territory.numPositions} />
            </Link>
          </td>
          <td className="numeric">
            <Numeric value={territory.numPeps} />
          </td>
        </tr>
      ))}
    </>
  );
}

type RegionTBodyProps = {
  label: string;
  territories: TerritorySummary[];
};

function Region({ label, territories }: RegionTBodyProps) {
  const subregions = Object.groupBy(territories, (t) => t.subregion ?? '');
  const subregionNames = Object.keys(subregions);
  subregionNames.sort();
  return (
    <tbody>
      <tr>
        <th colSpan={3} id={`region-${slugify(label, { lower: true })}`}>
          {label}
        </th>
      </tr>
      {subregionNames.map((subregion) => (
        <Subregion
          key={subregion}
          label={subregion}
          territories={subregions[subregion]!}
        />
      ))}
    </tbody>
  );
}

type TerritoryTableProps = {
  regions: Partial<Record<string, TerritorySummary[]>>;
  regionNames: string[];
};

function TerritoryTable({ regions, regionNames }: TerritoryTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th className="numeric text-nowrap">
            Positions
            <HelpLink href="/docs/pep/methodology/" />
          </th>
          <th className="numeric text-nowrap">
            PEPs
            <HelpLink
              href="/docs/topics/#peps"
              tooltipId="help-pep"
              placement="left"
            >
              Politically Exposed Persons
            </HelpLink>
          </th>
        </tr>
      </thead>
      {regionNames.map((region) => (
        <Region key={region} label={region} territories={regions[region]!} />
      ))}
    </Table>
  );
}

export default async function Page() {
  // Fetch all data in parallel
  const [territoryInfo, pepResponse, positionResponse] = await Promise.all([
    getTerritoriesByCode(),
    fetchApiCached<ISearchAPIResponse>(`/search/default`, {
      limit: 0,
      topics: 'role.pep',
      facets: ['countries'],
    }),
    fetchApiCached<ISearchAPIResponse>(`/search/default`, {
      limit: 0,
      schema: 'Position',
      facets: ['countries'],
    }),
  ]);

  // Build territory summaries from facets
  const territories = new Map<string, TerritorySummary>();

  for (const { name: code, count } of positionResponse.facets.countries
    .values) {
    const info = territoryInfo.get(code);
    if (!info) continue;
    territories.set(code, {
      code,
      label: info.label_short,
      numPeps: 0,
      numPositions: count,
      region: info.region,
      subregion: info.subregion,
    });
  }

  for (const { name: code, count } of pepResponse.facets.countries.values) {
    const territory = territories.get(code);
    if (territory) {
      territory.numPeps = count;
    }
  }

  const regions = Object.groupBy(
    Array.from(territories.values()),
    (t) => t.region ?? '',
  );
  const regionNames = Object.keys(regions);
  regionNames.sort();

  return (
    <LayoutFrame activeSection="research">
      <div className="claim-banner">
        <Container>
          <Row>
            <h1 className="claim">{CLAIM}</h1>
            <p className="sub-claim">{SUBCLAIM}</p>
          </Row>
        </Container>
      </div>
      <Container className="content-area">
        <Row>
          <Col md={9}>
            <h2 id="what">What are Politically Exposed Persons?</h2>
            <p>
              Politically exposed persons (PEP) is a term from the financial
              services industry to describe individuals who have been entrusted
              with a prominent public function. This{' '}
              <Link href="/docs/pep/methodology/#types">might include</Link>{' '}
              members of cabinets, parliaments, senior public servants and
              military personnel, or managers of state-owned companies.
            </p>
            <p>
              Being classified as a PEP <strong>does not</strong> imply any
              misconduct. However, the concept is important because PEPs and
              members of their families should be the subject of enhanced public
              scrutiny. Identifying PEPs and conducting enhanced due diligence
              on the origins of their wealth is mandated by financial crime laws
              in most countries.
            </p>

            <h2>Our take on PEP data</h2>
            <p>
              The scope of PEP data is less well-defined compared to anti-money
              laundering datasets such as sanctions lists. Our goal is therefore
              to make the scope and depth of our data coverage transparent and
              publish the{' '}
              <Link href="/docs/pep/methodology">underlying methodology</Link>.
            </p>
            <p>
              By <strong>mapping out the political positions</strong> that
              should be included on a country-by-country basis, we define
              quality metrics that measure coverage across time, jurisdiction
              and level of government.
            </p>
            <p>
              We focus on automating the collection of PEP data rather than
              relying on the manual monitoring political events and election
              results. Our ultimate objective is to help expand the coverage of
              political persons in community-driven data resources like{' '}
              <Link href="https://www.wikidata.org/">Wikidata</Link>. This way,
              the information ultimately becomes a commodity, produced via a
              distributed process.
            </p>

            <h2 id="coverage">Data coverage</h2>
            <p>
              Our top priority is comprehensive coverage of PEPs at national
              level of influence.
            </p>

            <Alert variant="success">
              <span>
                The data coverage survey shows a{' '}
                <strong>work in progress</strong>. We are continuously expanding
                the coverage, and adding further metadata the listed positions.
                Read more about{' '}
                <Link href="/docs/pep/methodology">our methodology</Link>, and{' '}
                <Link href="#contribute">see how you can help</Link>.
              </span>
            </Alert>
            <TerritoryTable regions={regions} regionNames={regionNames} />

            <h2 id="sources">Where is our PEP data sourced from?</h2>
            <p>
              OpenSanctions automatically monitors and imports global databases
              into our data, such as lists of world leaders. We are also
              expanding our coverage of nationally published data, such as lists
              of parliamentarians or state governors. We{' '}
              <Link href={'/docs/enrichment/'}>enrich the PEP data</Link> with
              further information about the potential influence of
              officeholders, e.g. to reflect a person holding both a public
              office and running a business.
            </p>
            <p>
              <Link href="/datasets/">Browse all PEP data sets →</Link>
            </p>

            <h2 id="use">How do I use the data?</h2>
            <p>
              You can{' '}
              <a href="https://opensanctions.org/datasets/peps/">
                download the PEP bulk data
              </a>{' '}
              or look up individual entries using the{' '}
              <a href="https://opensanctions.org/api/">API</a>. Commercial users
              can license the dataset as part of the OpenSanctions{' '}
              <Link href="/licensing/">bulk data license</Link>. We do not offer
              a separate licensing option for PEPs data alone.
            </p>
            <p>
              Our{' '}
              <Link href="/docs/pep/methodology">
                methodology documentation explains
              </Link>{' '}
              how PEP position information can be used to select custom subsets
              of the data for specific use cases.
            </p>

            <h2 id="contribute">How can I help?</h2>
            <p>
              If you want to help map out political positions and their office
              holders, please consider using one of the following paths:
            </p>
            <ul className="spaced">
              <li>
                <strong>Want to add or enrich individual PEP profiles?</strong>{' '}
                Contribute to Wikidata&apos;s{' '}
                <Link href="https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician">
                  WikiProject Every Politician
                </Link>
                . This is a community-driven effort to maintain a database of
                political positions. Like all Wikipedia projects, it has
                community review and verification standards. Start by getting a
                sense of Wikidata&apos;s{' '}
                <Link href="https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician/Political_data_model">
                  political data model
                </Link>
                , and allow for a delay of several days for Wikidata edits to be
                reflected in OpenSanctions.
              </li>
              <li>
                <strong>Want to add a bulk data crawler?</strong> Our crawlers
                are{' '}
                <Link href="https://github.com/opensanctions/opensanctions/tree/main/datasets">
                  open source code
                </Link>
                , using the zavod data collection framework (Python). Check out
                the <Link href="/docs/criteria">data inclusion criteria</Link>,
                and the{' '}
                <Link href="https://zavod.opensanctions.org/tutorial/">
                  crawler writing tutorial
                </Link>
                . Our{' '}
                <Link href="https://bit.ly/osa-sources">
                  data source wishlist
                </Link>{' '}
                is a good source of inspiration.
              </li>
              <li>
                <strong>Want to partner up?</strong> Please feel free to{' '}
                <Link href="/contact/">reach out to us</Link> to discuss other
                ideas for collaboration. As we are cleaning up and enhancing the
                position listings above using bulk data processing techniques,
                individual corrections sent via email will be of somewhat
                limited benefit.
              </li>
            </ul>
          </Col>
          <Col md={3} className="d-none d-md-block sidebar-nav">
            <Sticky>
              <Menu
                items={[
                  { href: '#what', label: 'Introduction' },
                  {
                    href: '#coverage',
                    label: 'Data coverage',
                    children: regionNames.map((region) => ({
                      href: `#region-${slugify(region, { lower: true })}`,
                      label: region,
                    })),
                  },
                  { href: '#sources', label: 'Sources' },
                  { href: '#use', label: 'Use the data' },
                  { href: '#contribute', label: 'Contribute' },
                ]}
                showLicense
              />
            </Sticky>
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  );
}
