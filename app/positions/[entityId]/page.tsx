import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Script from 'next/script';

import DatasetCard from '@/components/DatasetCard';
import ExternalLinks from '@/components/ExternalLinks';
import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { getAdjacent, getEntityDatasets, getMapCountryData } from '@/lib/data';
import { getSchemaEntityPage } from '@/lib/schema';
import { getTerritoryInfo } from '@/lib/territory';
import { getFirst, getEntityProperty, PropResults } from '@/lib/types';

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
  const territoryInfo = countryCode
    ? await getTerritoryInfo(countryCode)
    : null;
  const title = territoryInfo
    ? `${position.caption} (${territoryInfo.label_short})`
    : position.caption;
  return {
    title,
    alternates: { canonical: `/positions/${position.id}/` },
  };
}

function HoldersTable({ occupancies }: { occupancies: PropResults }) {
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
  const [datasets, territoryInfo, countryDataArray] = await Promise.all([
    getEntityDatasets(position),
    countryCode ? getTerritoryInfo(countryCode) : null,
    countryCode ? getMapCountryData() : Promise.resolve([]),
  ]);

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
      {territoryInfo ? (
        <Hero
          title={position.caption}
          background={
            <WorldMap
              countryDataArray={countryDataArray}
              focusTerritory={territoryInfo}
            />
          }
        >
          <div className="hero-subtitle">
            Political position in{' '}
            <Link href={`/territories/${territoryInfo.code}/`}>
              {territoryInfo.label_short}
            </Link>
          </div>
        </Hero>
      ) : (
        <Container className="pt-3">
          <h1>{position.caption}</h1>
        </Container>
      )}
      <Container className="pt-3">
        <section id="holders">
          <h2>Position holders</h2>
          {occupancies ? (
            <HoldersTable occupancies={occupancies} />
          ) : (
            <p>No holders found.</p>
          )}
        </section>

        <section id="sources">
          <h2>Data sources</h2>
          {datasets.map((d) => (
            <DatasetCard key={d.name} dataset={d} />
          ))}
        </section>

        <ExternalLinks entity={position} />
      </Container>
    </LayoutFrame>
  );
}
