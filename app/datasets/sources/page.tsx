import Dataset from '@/components/Dataset';
import LayoutFrame from '@/components/layout/LayoutFrame';
import { Button, Col, Container, Row } from '@/components/wrapped';
import { getDatasetsByNames, getDatasetsByScope } from '@/lib/data';
import { getGenerateMetadata } from '@/lib/meta';
import { isCollection } from '@/lib/types';

import { SourcesFilter } from '@/components/SourcesFilter';
import { Summary } from '@/components/util';
import { PageProps } from '@/components/utils/PageProps';
import { EXTRA_COLLECTIONS, FEATURED_COLLECTIONS, MAIN_DATASET } from '@/lib/constants';
import { arrayFirst } from '@/lib/util';
import classNames from 'classnames';
import { FileEarmarkSpreadsheetFill } from 'react-bootstrap-icons';
import styles from '@/styles/Dataset.module.scss';

const TITLE = `Data sources`
const SCOPES = [...FEATURED_COLLECTIONS, ...EXTRA_COLLECTIONS]

export async function generateMetadata() {
  return getGenerateMetadata({
    title: TITLE
  })
}


export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  if (searchParams === undefined) {
    return <LayoutFrame activeSection="datasets" />;
  }
  const sortedScopes = await getDatasetsByNames(SCOPES);
  const scopes = sortedScopes.sort((a, b) => SCOPES.indexOf(a.name) - SCOPES.indexOf(b.name));
  const scopeName = arrayFirst(searchParams['scope']) || MAIN_DATASET;
  // if (!SCOPES.includes(scopeName)) {
  //   const scope = await getDatasetByName(scopeName);
  //   if (scope !== undefined && isCollection(scope)) {
  //     scopes.push(scope);
  //   }
  // }
  const showLatestText = arrayFirst(searchParams['latest']) || "false";
  const showLatest = showLatestText === "true";
  const allDatasets = await getDatasetsByScope(scopeName)
  const datasets = allDatasets.filter((d) => !d.hidden);
  const allSources = datasets.filter((d) => !isCollection(d));
  const allSorted = (!showLatest) ? allSources : allSources.sort((a, b) => {
    if (a.coverage?.start === undefined && b.coverage?.start === undefined) {
      return 0; // both are undefined, consider them equal
    } else if (a.coverage?.start === undefined) {
      return 1; // a is undefined, consider it greater
    } else if (b.coverage?.start === undefined) {
      return -1; // b is undefined, consider it greater
    } else {
      return a.coverage.start < b.coverage.start ? 1 : -1; // normal comparison
    }
  });
  return (
    <LayoutFrame activeSection="datasets">
      <Container className={styles.datasetIndex}>
        <h1>
          {TITLE}
          <Button
            variant="outline-dark"
            size="sm"
            className={classNames("d-print-none", styles.csvLink)}
            href="/datasets/sources.csv"
          >
            <FileEarmarkSpreadsheetFill className="bsIcon" />
            {' '}CSV
          </Button>
        </h1>
        <Row>
          <Col md="9">
            <Summary summary="OpenSanctions is built from a multitude of public data sources, which are
              imported, processed and combined into a coherent dataset. This page lists the sources that
              are currently included in the database." />
          </Col>
        </Row>
        <SourcesFilter scopes={scopes} scopeName={scopeName} showLatest={false} />
        <Row>
          <Dataset.Table datasets={allSorted} frequency={!showLatest} publisher dateAdded={showLatest} />
        </Row>
      </Container>
    </LayoutFrame >
  )
}
