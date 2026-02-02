import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Script from 'next/script';

import DataSourcesSection from '@/components/DataSourcesSection';
import ExternalLinks from '@/components/ExternalLinks';
import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import {
  getAdjacent,
  getEntityDatasets,
  getTerritorySummaries,
  getTerritories,
} from '@/lib/data';
import { getSchemaEntityPage } from '@/lib/schema';
import { EntityData, getFirst, getEntityProperty } from '@/lib/types';

export const maxDuration = 25;

interface PositionPageProps {
  params: Promise<{ entityId: string }>;
}

export async function generateMetadata({ params }: PositionPageProps) {
  const data = await getAdjacent((await params).entityId);
  if (data === null) {
    return { title: 'Position not found' };
  }
  const position = data.entity;
  const countryCode = getFirst(position, 'country');
  const territories = await getTerritories();
  const territory = countryCode
    ? territories.find((t) => t.code === countryCode)
    : null;
  const title = territory
    ? `${position.caption} (${territory.name})`
    : position.caption;
  return {
    title,
    alternates: { canonical: `/positions/${position.id}/` },
  };
}

function HoldersTable({
  occupancies,
}: {
  occupancies: { results: EntityData[] };
}) {
  if (occupancies.results.length === 0) {
    return <p>No known holders.</p>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Person</th>
          <th>Start date</th>
          <th>End date</th>
        </tr>
      </thead>
      <tbody>
        {occupancies.results.map((occupancy) => {
          const holder = getEntityProperty(occupancy, 'holder')[0];
          return (
            <tr key={occupancy.id}>
              <td>
                {holder ? (
                  <Link href={`/persons/${holder.id}/`}>{holder.caption}</Link>
                ) : (
                  '-'
                )}
              </td>
              <td>{getFirst(occupancy, 'startDate') || '-'}</td>
              <td>{getFirst(occupancy, 'endDate') || '-'}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default async function PositionPage({ params }: PositionPageProps) {
  const resolvedParams = await params;
  const data = await getAdjacent(resolvedParams.entityId);
  if (data === null) {
    notFound();
  }
  const position = data.entity;
  if (position.id !== resolvedParams.entityId) {
    redirect(`/positions/${position.id}/`);
  }
  if (position.schema !== 'Position') {
    redirect(`/persons/${position.id}/`);
  }
  const countryCode = getFirst(position, 'country');
  const [datasets, territories, territorySummaries] = await Promise.all([
    getEntityDatasets(position),
    getTerritories(),
    countryCode ? getTerritorySummaries() : Promise.resolve([]),
  ]);
  const territory = countryCode
    ? territories.find((t) => t.code === countryCode)
    : null;

  const structured = getSchemaEntityPage(position);
  const occupancies = data.adjacent['occupancies'];

  return (
    <LayoutFrame activeSection="research">
      {structured && (
        <Script
          type="application/ld+json"
          id="json-ld"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
        />
      )}
      {territory ? (
        <Hero
          title={position.caption}
          background={
            <WorldMap
              territories={territorySummaries}
              focusTerritory={territory}
            />
          }
        >
          <div className="hero-subtitle">
            Political position in{' '}
            <Link href={`/territories/${territory.code}/`}>
              {territory.name}
            </Link>
          </div>
        </Hero>
      ) : (
        <Container className="pt-3">
          <h1>{position.caption}</h1>
        </Container>
      )}
      <Container className="py-5">
        <section id="holders" className="mb-5">
          <h2>Position holders</h2>
          {occupancies ? (
            <HoldersTable occupancies={occupancies} />
          ) : (
            <p>No holders found.</p>
          )}
        </section>

        <ExternalLinks entity={position} />

        <DataSourcesSection datasets={datasets} />
      </Container>
    </LayoutFrame>
  );
}
