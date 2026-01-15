import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Script from 'next/script';

import Dataset from '@/components/Dataset';
import LayoutFrame from '@/components/layout/LayoutFrame';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { getAdjacent, getEntity, getEntityDatasets } from '@/lib/data';
import { getSchemaEntityPage } from '@/lib/schema';
import {
  EntityData,
  getFirst,
  getEntityProperty,
  IPropResults,
} from '@/lib/types';

export const maxDuration = 25;

interface PositionPageProps {
  params: Promise<{ entityId: string }>;
}

export async function generateMetadata({ params }: PositionPageProps) {
  const entity = await getEntity((await params).entityId);
  if (entity === null) {
    return { title: 'Position not found' };
  }
  return {
    title: entity.caption,
    alternates: { canonical: `/positions/${entity.id}/` },
  };
}

function PersonLink({ person }: { person: EntityData }) {
  return <Link href={`/persons/${person.id}/`}>{person.caption}</Link>;
}

function HoldersTable({ occupancies }: { occupancies: IPropResults }) {
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
              <td>{holder ? <PersonLink person={holder} /> : '-'}</td>
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
  const position = await getEntity(resolvedParams.entityId);
  if (position === null) {
    notFound();
  }
  if (position.id !== resolvedParams.entityId) {
    redirect(`/positions/${position.id}/`);
  }
  if (position.schema !== 'Position') {
    redirect(`/persons/${position.id}/`);
  }
  const datasets = await getEntityDatasets(position);
  const propsResults = await getAdjacent(position.id);

  const structured = getSchemaEntityPage(position);

  // Get occupancies (people who held this position)
  const occupancies = propsResults?.adjacent['occupancies'];

  return (
    <LayoutFrame activeSection="research">
      {structured && (
        <Script
          type="application/ld+json"
          id="json-ld"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
        />
      )}
      <Container className="pt-3">
        <h1>{position.caption}</h1>

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
            <Dataset key={d.name} dataset={d} />
          ))}
        </section>
      </Container>
    </LayoutFrame>
  );
}
