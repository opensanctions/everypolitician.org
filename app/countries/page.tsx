import Link from 'next/link';
import slugify from 'slugify';

import { Numeric } from '@/components/Formatting';
import { HelpLink } from '@/components/HelpLink';
import LayoutFrame from '@/components/layout/LayoutFrame';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { getMapCountryData } from '@/lib/data';
import { getTerritoriesByCode } from '@/lib/territory';

import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Countries - EveryPolitician',
  description:
    'Browse political positions and office-holders by country and territory.',
  alternates: { canonical: '/countries/' },
};

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
            <Link
              prefetch={false}
              href={`/countries/${territory.code}/national/`}
            >
              {territory.label}
            </Link>
          </td>
          <td className="numeric text-end">
            <Link
              prefetch={false}
              href={`/countries/${territory.code}/national/`}
            >
              <Numeric value={territory.numPositions} />
            </Link>
          </td>
          <td className="numeric text-end">
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
          <th className="numeric text-end text-nowrap">
            Positions
            <HelpLink href="/docs/methodology/" />
          </th>
          <th className="numeric text-end text-nowrap">
            Politicians
            <HelpLink
              href="/docs/methodology/"
              tooltipId="help-politicians"
              placement="left"
            >
              Political office-holders in our database
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

export default async function CountriesPage() {
  const [territoryInfo, countryDataArray] = await Promise.all([
    getTerritoriesByCode(),
    getMapCountryData(),
  ]);

  const territories = new Map<string, TerritorySummary>();
  for (const [code, data] of countryDataArray) {
    const info = territoryInfo.get(code);
    if (!info) continue;
    territories.set(code, {
      code,
      label: data.label,
      numPeps: data.numPeps,
      numPositions: data.numPositions,
      region: info.region,
      subregion: info.subregion,
    });
  }

  const regions = Object.groupBy(
    Array.from(territories.values()),
    (t) => t.region ?? '',
  );
  const regionNames = Object.keys(regions);
  regionNames.sort();

  return (
    <LayoutFrame activeSection="countries">
      <Container className="pt-3">
        <h1>Countries</h1>
        <p>
          Browse political positions and office-holders by country and
          territory.
        </p>
        <TerritoryTable regions={regions} regionNames={regionNames} />
      </Container>
    </LayoutFrame>
  );
}
