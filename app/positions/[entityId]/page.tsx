import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { HelpLink } from '@/components/clientUtil';
import Dataset from '@/components/Dataset';
import { EntityFactsheet, EntitySchemaTable, EntityTopics } from '@/components/Entity';
import LayoutFrame from '@/components/layout/LayoutFrame';
import { BlockedEntity, LicenseInfo } from '@/components/Policy';
import Research from '@/components/Research';
import { SpacedList, Sticky } from '@/components/util';
import StructuredData from '@/components/utils/StructuredData';
import { Col, Container, Nav, NavLink, Row } from '@/components/wrapped';
import { BASE_URL } from '@/lib/constants';
import { getAdjacent, getDatasets, getEntity, getEntityDatasets, isBlocked, isIndexRelevant } from '@/lib/data';
import { Entity, Property } from '@/lib/ftm';
import { compareDisplayProps } from '@/lib/ftm/ordering';
import { getGenerateMetadata } from '@/lib/meta';
import { getSchemaEntityPage } from '@/lib/schema';
import { IDataset, IPropsResults, isExternal, isSource } from '@/lib/types';

import styles from '@/styles/Entity.module.scss';

export const maxDuration = 25; // seconds

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

function getEntityProperties(entity: Entity) {
  return entity.getDisplayProperties()
    .filter((p) => p.type.name === 'entity' && entity.getProperty(p).length > 0)
    .sort(compareDisplayProps);
}

type RelationshipsSectionProps = {
  propsResults: IPropsResults
  entityProperties: Property[]
  allDatasets: IDataset[]
}

function RelationshipsSection({ propsResults, entityProperties, allDatasets }: RelationshipsSectionProps) {
  return entityProperties.length > 0 ? (
    <>
      {entityProperties.map((prop) => (
        <div className={styles.entityPageSection} key={prop.qname}>
          <EntitySchemaTable
            prop={prop}
            propResults={propsResults.adjacent.get(prop)}
            datasets={allDatasets}
          />
        </div>
      ))}
    </>) : (<p>No relationships to other entities found.</p>)
}

export default async function PositionPage({ params }: PositionPageProps) {
  const resolvedParams = await params;
  const entity = await getEntity(resolvedParams.entityId);
  if (entity === null) {
    notFound();
  }
  if (entity.id !== resolvedParams.entityId) {
    redirect(`/positions/${entity.id}/`);
  }
  if (!entity.schema.isA('Position')) {
    redirect(`/persons/${entity.id}/`);
  }
  if (isBlocked(entity)) {
    return <BlockedEntity entity={entity} />
  }

  const datasets = await getEntityDatasets(entity);
  const allDatasets = await getDatasets();
  const propsResults = await getAdjacent(entity.id);

  const structured = getSchemaEntityPage(entity, datasets);
  const entityProperties = getEntityProperties(entity);
  const sources = datasets.filter(isSource);
  const externals = datasets.filter(isExternal);

  return (
    <LayoutFrame activeSection="research">
      <StructuredData data={structured} />
      <Research.Context hidePrint>
        <Container>
          <Row>
            <Col md={9}>
              <h1>
                {entity.caption}
              </h1>
            </Col>
            <Col md={3}></Col>
          </Row>
          <Row>
            <Col md={9} className="order-1">
              <a id="factsheet"></a>
              <EntityTopics entity={entity} />
              <EntityFactsheet entity={entity} />

              <h2><a id="links"></a>Relationships</h2>
              {propsResults && (
                <RelationshipsSection
                  propsResults={propsResults}
                  entityProperties={getEntityProperties(propsResults.entity)}
                  allDatasets={allDatasets}
                />
              )}

              <div className={styles.entityPageSection}>
                <h2><a id="sources"></a>Data sources</h2>
                {sources.map((d) => (
                  <Dataset.Item key={d.name} dataset={d} />
                ))}
                {externals.length > 0 && (
                  <>
                    {sources.length > 0 && (
                      <h5>External databases</h5>
                    )}
                    <p>
                      The record has
                      been <Link href="/docs/enrichment/">enriched with data</Link> from
                      the following external databases:
                    </p>
                    {externals.map((d) => (
                      <Dataset.Item key={d.name} dataset={d} />
                    ))}
                  </>
                )}
              </div>
              <div className={styles.entityPageSection}>
                <hr />
                {entity.referents.length > 0 && (
                  <>
                    Source data IDs<HelpLink href="/docs/identifiers/" />: <SpacedList values={entity.referents.map((r) => <code key={r}>{r}</code>)} />
                  </>
                )}
                <p>For experts: <a rel="nofollow" href={`/statements/${entity.id}/`}>raw data explorer</a></p>
              </div>
            </Col>
            <Col md={3} className="order-2">
              <Sticky>
                <Nav className="flex-column d-print-none d-none d-md-flex">
                  <NavLink href="#factsheet">Factsheet</NavLink>
                  {entityProperties.length > 0 && <NavLink href="#links">Relationships</NavLink>}
                  <NavLink href="#sources">Data sources</NavLink>
                </Nav>
                <LicenseInfo />
              </Sticky>
            </Col>
          </Row>
        </Container>
      </Research.Context>
    </LayoutFrame>
  )
}
