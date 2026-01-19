import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Script from 'next/script';

import Dataset from '@/components/Dataset';
import ExternalLinks from '@/components/ExternalLinks';
import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { getAdjacent, getEntityDatasets } from '@/lib/data';
import { getSchemaEntityPage } from '@/lib/schema';
import {
  EntityData,
  getFirst,
  getStringProperty,
  getEntityProperty,
  IPropResults,
} from '@/lib/types';

export const maxDuration = 25;

interface PersonPageProps {
  params: Promise<{ entityId: string }>;
}

export async function generateMetadata({ params }: PersonPageProps) {
  const entityId = (await params).entityId;
  const data = await getAdjacent(entityId);
  if (data === null) {
    return { title: 'Person not found' };
  }

  const occupancies = data.adjacent['positionOccupancies']?.results ?? [];

  // Find newest position (sort by startDate descending, nulls last)
  const newestOccupancy = occupancies
    .filter((occ) => getEntityProperty(occ, 'post')[0])
    .sort((a, b) => {
      const dateA = getFirst(a, 'startDate') ?? '';
      const dateB = getFirst(b, 'startDate') ?? '';
      return dateB.localeCompare(dateA);
    })[0];

  const newestPosition = newestOccupancy
    ? getEntityProperty(newestOccupancy, 'post')[0]
    : null;

  return {
    title: data.entity.caption,
    robots: { index: false },
    ...(newestPosition && {
      alternates: { canonical: `/positions/${newestPosition.id}/` },
    }),
  };
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
          <th className="text-end">Start date</th>
          <th className="text-end">End date</th>
        </tr>
      </thead>
      <tbody>
        {occupancies.results.map((occupancy) => {
          const post = getEntityProperty(occupancy, 'post')[0];
          return (
            <tr key={occupancy.id}>
              <td>
                {post ? (
                  <Link href={`/positions/${post.id}/`}>{post.caption}</Link>
                ) : (
                  '-'
                )}
              </td>
              <td className="text-end">
                {getFirst(occupancy, 'startDate') || '-'}
              </td>
              <td className="text-end">
                {getFirst(occupancy, 'endDate') || '-'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default async function PersonPage({ params }: PersonPageProps) {
  const resolvedParams = await params;
  const data = await getAdjacent(resolvedParams.entityId);
  if (data === null) {
    notFound();
  }
  const person = data.entity;
  if (person.id !== resolvedParams.entityId) {
    redirect(`/persons/${person.id}/`);
  }
  if (person.schema !== 'Person') {
    redirect(`/positions/${person.id}/`);
  }
  const datasets = await getEntityDatasets(person);
  const structured = getSchemaEntityPage(person);
  const occupancies = data.adjacent['positionOccupancies'];

  return (
    <LayoutFrame activeSection="research">
      {structured && (
        <Script
          type="application/ld+json"
          id="json-ld"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
        />
      )}
      <Hero title={person.caption} />
      <Container className="pt-3">
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
          {datasets.map((d) => (
            <Dataset key={d.name} dataset={d} />
          ))}
        </section>

        <ExternalLinks entity={person} />
      </Container>
    </LayoutFrame>
  );
}
