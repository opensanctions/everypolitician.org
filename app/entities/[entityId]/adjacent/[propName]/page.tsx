
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

import Research from '@/components/Research';
import { Row, Col, Container } from '@/components/wrapped';
import { getAdjacentByProp, getDatasets, getEntity } from '@/lib/data';
import LayoutFrame from '@/components/layout/LayoutFrame';
import { EntitySchemaTable } from '@/components/Entity';
import { ServerSearchParams } from '@/components/utils/PageProps';
import { ArrowLeft } from 'react-bootstrap-icons';
import { ResponsePagination } from '@/components/util';
import { getGenerateMetadata } from '@/lib/meta';
import { generateEntityMetadata } from '@/app/entities/common';

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
  if (entity.id !== params.entityId) {
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
