import Link from 'next/link';

import { HelpLink } from '@/components/HelpLink';
import LayoutFrame from '@/components/layout/LayoutFrame';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { getTerritorySummaries } from '@/lib/data';
import { RegionsNav } from './RegionsNav';

import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Regions – EveryPolitician',
  description: 'Browse political positions and office-holders by region.',
  alternates: { canonical: '/regions/' },
};

type RegionSummary = {
  name: string;
  slug: string;
  numTerritories: number;
  numPositions: number;
  numPeps: number;
};

export default async function RegionsOverviewPage() {
  const territories = await getTerritorySummaries();
  const regionGroups = Object.groupBy(territories, (t) => t.region);

  const regionSummaries: RegionSummary[] = Object.entries(regionGroups)
    .map(([name, items]) => ({
      name,
      slug: name.toLowerCase(),
      numTerritories: items!.length,
      numPositions: items!.reduce((sum, t) => sum + t.numPositions, 0),
      numPeps: items!.reduce((sum, t) => sum + t.numPeps, 0),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const regionNames = regionSummaries.map((r) => r.name);

  return (
    <LayoutFrame>
      <Container className="py-4 mb-5">
        <h1>Research</h1>
        <p>Browse political positions and office-holders by region.</p>
        <RegionsNav regions={regionNames} />
        <Table>
          <colgroup>
            <col />
            <col style={{ width: 'clamp(8rem, 12vw, 15rem)' }} />
            <col style={{ width: 'clamp(8rem, 12vw, 15rem)' }} />
            <col style={{ width: 'clamp(8rem, 12vw, 15rem)' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Region</th>
              <th className="numeric text-end">Territories</th>
              <th className="numeric text-end text-nowrap">
                <HelpLink
                  href="/about/methodology/"
                  tooltipId="help-positions"
                  tooltip="Political offices tracked in our database"
                >
                  Positions
                </HelpLink>
              </th>
              <th className="numeric text-end text-nowrap">
                <HelpLink
                  href="/about/methodology/"
                  tooltipId="help-politicians"
                  tooltip="Political office-holders in our database"
                >
                  Politicians
                </HelpLink>
              </th>
            </tr>
          </thead>
          <tbody>
            {regionSummaries.map((region) => (
              <tr key={region.slug}>
                <td>
                  <Link prefetch={false} href={`/regions/${region.slug}/`}>
                    {region.name}
                  </Link>
                </td>
                <td className="numeric text-end">{region.numTerritories}</td>
                <td className="numeric text-end">
                  {region.numPositions.toLocaleString('en-US')}
                </td>
                <td className="numeric text-end">
                  {region.numPeps.toLocaleString('en-US')}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Row>
          <Col md={8}>
            <h3>Why regions?</h3>
            <p>
              Political geography is complicated. Not everyone agrees on
              borders, sovereignty, or who controls what. Territories may be
              disputed, occupied, or governed differently from how they appear
              on a standard map. EveryPolitician aims to track political offices
              wherever they exist — including internationally recognised states,
              territories with de facto self-governance, and subnational
              jurisdictions.
            </p>
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  );
}
