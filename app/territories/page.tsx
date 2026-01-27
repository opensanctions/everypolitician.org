import Link from 'next/link';

import { HelpLink } from '@/components/HelpLink';
import LayoutFrame from '@/components/layout/LayoutFrame';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { getTerritorySummaries, TerritorySummary } from '@/lib/data';

import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Territories - EveryPolitician',
  description:
    'Browse political positions and office-holders by country and territory.',
  alternates: { canonical: '/territories/' },
};

function TerritoryRow({ territory }: { territory: TerritorySummary }) {
  return (
    <tr>
      <td>
        <Link
          prefetch={false}
          href={`/territories/${territory.code}/national/`}
        >
          {territory.label}
        </Link>
      </td>
      <td className="numeric text-end">
        <Link
          prefetch={false}
          href={`/territories/${territory.code}/national/`}
        >
          {territory.numPositions || '-'}
        </Link>
      </td>
      <td className="numeric text-end">{territory.numPeps || '-'}</td>
    </tr>
  );
}

function RegionTable({ territories }: { territories: TerritorySummary[] }) {
  const subregions = Object.groupBy(
    territories,
    (t) => t.subregion ?? 'undefined',
  );
  const subregionNames = Object.keys(subregions).sort();

  return (
    <Table>
      <colgroup>
        <col />
        <col style={{ width: 'clamp(8rem, 12vw, 15rem)' }} />
        <col style={{ width: 'clamp(8rem, 12vw, 15rem)' }} />
      </colgroup>
      {subregionNames.map((subregion) => {
        const items = subregions[subregion]!;
        items.sort((a, b) => a.label.localeCompare(b.label));
        return (
          <tbody key={subregion}>
            <tr>
              <th>{subregion !== 'undefined' ? subregion : 'Name'}</th>
              <th className="numeric text-end text-nowrap">
                <HelpLink
                  href="/docs/methodology/"
                  tooltipId={`help-positions-${subregion}`}
                  tooltip="Political offices tracked in our database"
                >
                  Positions
                </HelpLink>
              </th>
              <th className="numeric text-end text-nowrap">
                <HelpLink
                  href="/docs/methodology/"
                  tooltipId={`help-politicians-${subregion}`}
                  tooltip="Political office-holders in our database"
                >
                  Politicians
                </HelpLink>
              </th>
            </tr>
            {items.map((territory) => (
              <TerritoryRow key={territory.code} territory={territory} />
            ))}
          </tbody>
        );
      })}
    </Table>
  );
}

export default async function CountriesPage() {
  const territories = await getTerritorySummaries();
  const regions = Object.groupBy(territories, (t) => t.region);
  const regionNames = Object.keys(regions);
  regionNames.sort();

  return (
    <LayoutFrame activeSection="territories">
      <Container className="pt-3">
        <h1>Territories</h1>
        <p>
          Browse political positions and office-holders by country and
          territory.
        </p>
        {regionNames.map((region) => (
          <section key={region}>
            <h2>{region}</h2>
            <RegionTable territories={regions[region]!} />
          </section>
        ))}
      </Container>
    </LayoutFrame>
  );
}
