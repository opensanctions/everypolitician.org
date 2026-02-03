import { notFound, redirect } from 'next/navigation';
import Script from 'next/script';

import DataSourcesSection from '@/components/DataSourcesSection';
import ExternalLinks from '@/components/ExternalLinks';
import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import OccupanciesTable from '@/components/OccupanciesTable';
import PersonProfile from '@/components/PersonProfile';
import Container from 'react-bootstrap/Container';
import { getAdjacent, getEntityDatasets } from '@/lib/data';
import { getSchemaEntityPage } from '@/lib/schema';
import { getFirst, getEntityProperty } from '@/lib/types';

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
    .filter((occ: any) => getEntityProperty(occ, 'post')[0])
    .sort((a: any, b: any) => {
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
  const occupancies = data.adjacent['positionOccupancies']?.results ?? [];
  const familyMembers = [
    ...(data.adjacent['familyPerson']?.results ?? []),
    ...(data.adjacent['familyRelative']?.results ?? []),
  ]
    .map((family: any) => family.properties?.relative?.[0]?.caption)
    .filter(Boolean);

  return (
    <LayoutFrame>
      {structured && (
        <Script
          type="application/ld+json"
          id="json-ld"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
        />
      )}
      <Hero title={person.caption} size="small" />
      <Container className="py-5">
        <section id="factsheet" className="mb-5">
          <h2 className="d-flex align-items-center">
            Profile
            <ExternalLinks entity={person} />
          </h2>
          <PersonProfile person={person} familyMembers={familyMembers} />
        </section>

        <section id="positions" className="mb-5">
          <h2>Positions held</h2>
          <OccupanciesTable occupancies={occupancies} />
        </section>

        <DataSourcesSection datasets={datasets} />
      </Container>
    </LayoutFrame>
  );
}
