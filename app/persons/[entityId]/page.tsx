import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import Dataset from '@/components/Dataset';
import LayoutFrame from '@/components/layout/LayoutFrame';
import { BlockedEntity, LicenseInfo } from '@/components/Policy';
import Research from '@/components/Research';
import { FormattedDate, SpacedList, Sticky } from '@/components/util';
import StructuredData from '@/components/utils/StructuredData';
import { Col, Container, Nav, NavLink, Row, Table } from '@/components/wrapped';
import { BASE_URL } from '@/lib/constants';
import { getAdjacent, getDatasets, getEntity, getEntityDatasets, isBlocked, isIndexRelevant } from '@/lib/data';
import { Entity } from '@/lib/ftm';
import { getGenerateMetadata } from '@/lib/meta';
import { getSchemaEntityPage } from '@/lib/schema';
import { IDataset, IPropResults, isExternal, isSource } from '@/lib/types';

import styles from '@/styles/Entity.module.scss';

export const maxDuration = 25;

interface PersonPageProps {
  params: Promise<{ entityId: string }>
}

export async function generateMetadata({ params }: PersonPageProps) {
  const entity = await getEntity((await params).entityId);
  if (entity === null) {
    return getGenerateMetadata({ title: 'Person not found' });
  }
  const title = isBlocked(entity) ? 'Blocked entity' : entity.caption;
  const noIndex = !isIndexRelevant(entity);
  const canonicalUrl = `${BASE_URL}/persons/${entity.id}/`;
  return getGenerateMetadata({
    title,
    noIndex,
    canonicalUrl: noIndex ? null : canonicalUrl
  });
}

function PersonLink({ person }: { person: Entity }) {
  return <Link href={`/persons/${person.id}/`}>{person.caption}</Link>;
}

function PositionLink({ position }: { position: Entity }) {
  return <Link href={`/positions/${position.id}/`}>{position.caption}</Link>;
}

function PersonFactsheet({ person, datasets }: { person: Entity, datasets: IDataset[] }) {
  const properties = [
    { label: 'Also known as', value: person.getStringProperty('alias').join(', ') },
    { label: 'Birth date', value: person.getFirst('birthDate') as string | null },
    { label: 'Birth place', value: person.getFirst('birthPlace') as string | null },
    { label: 'Nationality', value: person.getStringProperty('nationality').join(', ') },
    { label: 'Gender', value: person.getFirst('gender') as string | null },
  ].filter(p => p.value);

  return (
    <Table className={styles.factsheet}>
      <tbody>
        {properties.map(({ label, value }) => (
          <tr key={label}>
            <th className={styles.cardProp}>{label}</th>
            <td>{value}</td>
          </tr>
        ))}
        <tr>
          <th className={styles.cardProp}>Last change</th>
          <td><FormattedDate date={person.last_change} /></td>
        </tr>
        <tr>
          <th className={styles.cardProp}>Data sources</th>
          <td>
            <SpacedList values={datasets.map((d) => <Dataset.Link key={d.name} dataset={d} />)} />
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

function OccupanciesTable({ occupancies }: { occupancies: IPropResults }) {
  if (occupancies.results.length === 0) {
    return <p>No positions held.</p>;
  }

  return (
    <Table bordered size="sm">
      <thead>
        <tr>
          <th>Position</th>
          <th>Start date</th>
          <th>End date</th>
        </tr>
      </thead>
      <tbody>
        {occupancies.results.map((occupancy) => {
          const post = occupancy.getProperty('post').find((v): v is Entity => typeof v !== 'string');
          return (
            <tr key={occupancy.id}>
              <td>{post ? <PositionLink position={post} /> : '-'}</td>
              <td>{(occupancy.getFirst('startDate') as string) || '-'}</td>
              <td>{(occupancy.getFirst('endDate') as string) || '-'}</td>
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
  if (!person.schema.isA('Person')) {
    redirect(`/positions/${person.id}/`);
  }
  if (isBlocked(person)) {
    return <BlockedEntity entity={person} />
  }

  const datasets = await getEntityDatasets(person);
  const allDatasets = await getDatasets();
  const propsResults = await getAdjacent(person.id);

  const structured = getSchemaEntityPage(person, datasets);
  const sources = datasets.filter(isSource);
  const externals = datasets.filter(isExternal);

  // Get occupancies (positions held by this person)
  const occupanciesProp = person.schema.getProperty('positionOccupancies');
  const occupancies = occupanciesProp ? propsResults?.adjacent.get(occupanciesProp) : undefined;

  return (
    <LayoutFrame activeSection="research">
      <StructuredData data={structured} />
      <Research.Context hidePrint>
        <Container>
          <Row>
            <Col md={9}>
              <h1>{person.caption}</h1>
            </Col>
            <Col md={3}></Col>
          </Row>
          <Row>
            <Col md={9} className="order-1">
              <section id="factsheet">
                <h2>Profile</h2>
                <PersonFactsheet person={person} datasets={sources} />
              </section>

              <section id="positions" className={styles.entityPageSection}>
                <h2>Positions held</h2>
                {occupancies ? (
                  <OccupanciesTable occupancies={occupancies} />
                ) : (
                  <p>No positions found.</p>
                )}
              </section>

              <section id="sources" className={styles.entityPageSection}>
                <h2>Data sources</h2>
                {sources.map((d) => (
                  <Dataset.Item key={d.name} dataset={d} />
                ))}
                {externals.length > 0 && (
                  <>
                    <h5>External databases</h5>
                    <p>
                      The record has been <Link href="/docs/enrichment/">enriched with data</Link> from
                      the following external databases:
                    </p>
                    {externals.map((d) => (
                      <Dataset.Item key={d.name} dataset={d} />
                    ))}
                  </>
                )}
              </section>
            </Col>
            <Col md={3} className="order-2">
              <Sticky>
                <Nav className="flex-column d-print-none d-none d-md-flex">
                  <NavLink href="#factsheet">Profile</NavLink>
                  <NavLink href="#positions">Positions held</NavLink>
                  <NavLink href="#sources">Data sources</NavLink>
                </Nav>
                <LicenseInfo />
              </Sticky>
            </Col>
          </Row>
        </Container>
      </Research.Context>
    </LayoutFrame>
  );
}
