
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'react-bootstrap-icons';

import { generateEntityMetadata } from '@/app/entities/common';
import { EntitySchemaTable } from '@/components/Entity';
import LayoutFrame from '@/components/layout/LayoutFrame';
import Research from '@/components/Research';
import { ResponsePagination } from '@/components/util';
import { ServerSearchParams } from '@/components/utils/PageProps';
import { Row, Col, Container } from '@/components/wrapped';
import { getAdjacentByProp, getDatasets, getEntity, isBlocked, isIndexRelevant } from '@/lib/data';
import { getGenerateMetadata } from '@/lib/meta';

interface PropertyAdjacentPageProps {
  params: Promise<{ entityId: string, propName: string }>
  searchParams: Promise<ServerSearchParams>
}

export async function generateMetadata(props: PropertyAdjacentPageProps) {
  const params = await props.params;
  const entity = await getEntity(params.entityId);
  if (entity === null) {
    return getGenerateMetadata({
      title: "Entity not found"
    });
  }
  const prop = entity.schema.getProperty(params.propName);
  if (prop === undefined) {
    return getGenerateMetadata({
      title: "Property not found"
    });
  }
  return generateEntityMetadata({
    params: props.params,
    title: `${prop.label} related to ${entity.caption}`
  });
}

export default async function PropertyAdjacentPage(props: PropertyAdjacentPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const offset = typeof searchParams.offset === 'string' ? searchParams.offset : "0";

  const entity = await getEntity(params.entityId);
  if (entity === null) {
    notFound();
  }
  if (entity.id !== params.entityId || isBlocked(entity)) {
    redirect(`/entities/${entity.id}/`);
  }
  const prop = entity.schema.getProperty(params.propName);
  const propResults = await getAdjacentByProp(entity.id, params.propName, offset);
  if (prop === undefined || propResults === null) {
    notFound();
  }
  const allDatasets = await getDatasets();

  return (
    <LayoutFrame activeSection="research">
      <Research.Context hidePrint>
        <Container>
          <Row>
            <Col md={9}>
              <h1>
                {entity.caption}
              </h1>
              <p>
                <Link href={`/entities/${entity.id}/`}>
                  <ArrowLeft /> Back to entity profile
                </Link>
                </p>
              <h2><a id="links"></a>{prop.label}</h2>
              <EntitySchemaTable
                prop={prop}
                propResults={propResults}
                datasets={allDatasets}
                entityId={params.entityId}
              />
              <ResponsePagination response={propResults} searchParams={searchParams} />
            </Col>
          </Row>
        </Container>
      </Research.Context>
    </LayoutFrame >
  )
}
