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
  getStringProperty,
  getEntityProperty,
  IPropResults,
  isExternal,
  isSource,
} from '@/lib/types';

export const maxDuration = 25;

interface PersonPageProps {
  params: Promise<{ entityId: string }>;
}

export async function generateMetadata({ params }: PersonPageProps) {
  const entity = await getEntity((await params).entityId);
  if (entity === null) {
    return { title: 'Person not found' };
  }
  return {
    title: entity.caption,
    robots: { index: false },
  };
}

function PositionLink({ position }: { position: EntityData }) {
  return <Link href={`/positions/${position.id}/`}>{position.caption}</Link>;
}

function PersonFactsheet({ person }: { person: EntityData }) {
  const properties = [
    {
      label: 'Also known as',
      value: getStringProperty(person, 'alias').join(', '),
    },
    { label: 'Date of birth', value: getFirst(person, 'birthDate') },
    { label: 'Place of birth', value: getFirst(person, 'birthPlace') },
    {
      label: 'Political affiliation',
      value: getStringProperty(person, 'political').join(', '),
    },
  ].filter((p) => p.value);

  if (properties.length === 0) {
    return null;
  }

  return (
    <Table>
      <tbody>
        {properties.map(({ label, value }) => (
          <tr key={label}>
            <th className="text-muted">{label}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function OccupanciesTable({ occupancies }: { occupancies: IPropResults }) {
  if (occupancies.results.length === 0) {
    return <p>No positions held.</p>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Position</th>
          <th>Start date</th>
          <th>End date</th>
        </tr>
      </thead>
      <tbody>
        {occupancies.results.map((occupancy) => {
          const post = getEntityProperty(occupancy, 'post')[0];
          return (
            <tr key={occupancy.id}>
              <td>{post ? <PositionLink position={post} /> : '-'}</td>
              <td>{getFirst(occupancy, 'startDate') || '-'}</td>
              <td>{getFirst(occupancy, 'endDate') || '-'}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default async function PersonPage({ params }: PersonPageProps) {
  const resolvedParams = await params;
  const person = await getEntity(resolvedParams.entityId);
  if (person === null) {
    notFound();
  }
  if (person.id !== resolvedParams.entityId) {
    redirect(`/persons/${person.id}/`);
  }
  if (person.schema !== 'Person') {
    redirect(`/positions/${person.id}/`);
  }
  const datasets = await getEntityDatasets(person);
  const propsResults = await getAdjacent(person.id);

  const structured = getSchemaEntityPage(person, datasets);
  const sources = datasets.filter(isSource);
  const externals = datasets.filter(isExternal);

  // Get occupancies (positions held by this person)
  const occupancies = propsResults?.adjacent['positionOccupancies'];

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
        <h1>{person.caption}</h1>

        <section id="factsheet">
          <h2>Profile</h2>
          <PersonFactsheet person={person} />
        </section>

        <section id="positions">
          <h2>Positions held</h2>
          {occupancies ? (
            <OccupanciesTable occupancies={occupancies} />
          ) : (
            <p>No positions found.</p>
          )}
        </section>

        <section id="sources">
          <h2>Data sources</h2>
          {sources.map((d) => (
            <Dataset key={d.name} dataset={d} />
          ))}
          {externals.length > 0 && (
            <>
              <h5>External databases</h5>
              <p>
                The record has been{' '}
                <Link href="/docs/enrichment/">enriched with data</Link> from
                the following external databases:
              </p>
              {externals.map((d) => (
                <Dataset key={d.name} dataset={d} />
              ))}
            </>
          )}
        </section>
      </Container>
    </LayoutFrame>
  );
}
