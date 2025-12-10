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
import { getAdjacent, getEntity, getEntityDatasets, isBlocked, isIndexRelevant } from '@/lib/data';
import { Entity } from '@/lib/ftm';
import { getGenerateMetadata } from '@/lib/meta';
import { getSchemaEntityPage } from '@/lib/schema';
import { IDataset, IPropResults, isExternal, isSource } from '@/lib/types';

import styles from '@/styles/Entity.module.scss';

export const maxDuration = 25;

interface PositionPageProps {
  params: Promise<{ entityId: string }>
}

export async function generateMetadata({ params }: PositionPageProps) {
  const entity = await getEntity((await params).entityId);
  if (entity === null) {
    return getGenerateMetadata({ title: 'Position not found' });
  }
  const title = isBlocked(entity) ? 'Blocked entity' : entity.caption;
  const noIndex = !isIndexRelevant(entity);
  const canonicalUrl = `${BASE_URL}/positions/${entity.id}/`;
  return getGenerateMetadata({
    title,
    noIndex,
    canonicalUrl: noIndex ? null : canonicalUrl
  });
}

function PersonLink({ person }: { person: Entity }) {
  return <Link href={`/persons/${person.id}/`}>{person.caption}</Link>;
}

function PositionFactsheet({ position, datasets }: { position: Entity, datasets: IDataset[] }) {
  const properties = [
    { label: 'Also known as', value: position.getStringProperty('alias').join(', ') },
    { label: 'Country', value: position.getFirst('country') as string | null },
    { label: 'Subnational area', value: position.getFirst('subnationalArea') as string | null },
    { label: 'Inception date', value: position.getFirst('inceptionDate') as string | null },
    { label: 'Dissolution date', value: position.getFirst('dissolutionDate') as string | null },
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
          <td><FormattedDate date={position.last_change} /></td>
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

function HoldersTable({ occupancies }: { occupancies: IPropResults }) {
  if (occupancies.results.length === 0) {
    return <p>No known holders.</p>;
  }

  return (
    <Table bordered size="sm">
      <thead>
        <tr>
          <th>Person</th>
          <th>Start date</th>
          <th>End date</th>
        </tr>
      </thead>
      <tbody>
        {occupancies.results.map((occupancy) => {
          const holder = occupancy.getProperty('holder').find((v): v is Entity => typeof v !== 'string');
          return (
            <tr key={occupancy.id}>
              <td>{holder ? <PersonLink person={holder} /> : '-'}</td>
              <td>{(occupancy.getFirst('startDate') as string) || '-'}</td>
              <td>{(occupancy.getFirst('endDate') as string) || '-'}</td>
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
  if (!position.schema.isA('Position')) {
    redirect(`/persons/${position.id}/`);
  }
  if (isBlocked(position)) {
    return <BlockedEntity entity={position} />
  }

  const datasets = await getEntityDatasets(position);
  const propsResults = await getAdjacent(position.id);

  const structured = getSchemaEntityPage(position, datasets);
  const sources = datasets.filter(isSource);
  const externals = datasets.filter(isExternal);

  // Get occupancies (people who held this position)
  const occupanciesProp = position.schema.getProperty('occupancies');
  const occupancies = occupanciesProp ? propsResults?.adjacent.get(occupanciesProp) : undefined;

  return (
    <LayoutFrame activeSection="research">
      <StructuredData data={structured} />
      <Research.Context hidePrint>
        <Container>
          <Row>
            <Col md={9}>
              <h1>{position.caption}</h1>
            </Col>
            <Col md={3}></Col>
          </Row>
          <Row>
            <Col md={9} className="order-1">
              <section id="factsheet">
                <h2>Position details</h2>
                <PositionFactsheet position={position} datasets={sources} />
              </section>

              <section id="holders" className={styles.entityPageSection}>
                <h2>Position holders</h2>
                {occupancies ? (
                  <HoldersTable occupancies={occupancies} />
                ) : (
                  <p>No holders found.</p>
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
                  <NavLink href="#factsheet">Position details</NavLink>
                  <NavLink href="#holders">Position holders</NavLink>
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
