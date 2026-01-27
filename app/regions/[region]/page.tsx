import Link from 'next/link';
import { notFound } from 'next/navigation';

import { HelpLink } from '@/components/HelpLink';
import LayoutFrame from '@/components/layout/LayoutFrame';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { getTerritorySummaries, TerritorySummary } from '@/lib/data';
import { RegionsNav } from '../RegionsNav';

import type { Metadata } from 'next';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const territories = await getTerritorySummaries();
  const regions = new Set(territories.map((t) => t.region.toLowerCase()));
  return Array.from(regions).map((region) => ({ region }));
}

function regionSlugToName(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export async function generateMetadata(props: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await props.params;
  const regionName = regionSlugToName(region);
  return {
    title: `${regionName} - Regions - EveryPolitician`,
    description: `Browse political positions and office-holders in ${regionName}.`,
    alternates: { canonical: `/regions/${region}/` },
  };
}

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

export default async function RegionPage(props: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await props.params;

  const allTerritories = await getTerritorySummaries();
  const territories = allTerritories.filter(
    (t) => t.region.toLowerCase() === region,
  );

  if (territories.length === 0) {
    notFound();
  }

  const regionNames = Array.from(
    new Set(allTerritories.map((t) => t.region)),
  ).sort();
  const regionName = regionSlugToName(region);

  return (
    <LayoutFrame activeSection="territories">
      <Container className="py-4 mb-5">
        <h1>Regions</h1>
        <p>Browse political positions and office-holders by region.</p>
        <RegionsNav regions={regionNames} />
        <RegionTable territories={territories} />
      </Container>
    </LayoutFrame>
  );
}
