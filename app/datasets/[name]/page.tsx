import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Download, Search, Github } from 'react-bootstrap-icons';

import { getDatasetStatistics } from '@/lib/datasets';
import Dataset from '@/components/Dataset';
import DatasetMetadataTable from '@/components/DatasetMetadataTable';
import LayoutFrame from '@/components/layout/LayoutFrame';
import { LicenseInfo } from '@/components/Policy';
import { FileSize, FormattedDate, JSONLink, Markdown, NumericBadge, SpacedList, Spacer, Sticky, Summary } from '@/components/util';
import StructuredData from '@/components/utils/StructuredData';
import { Alert, AlertHeading, Badge, Button, Col, Container, Form, FormControl, InputGroup, Nav, NavLink, Row, Table } from '@/components/wrapped';
import { API_URL, BASE_URL } from '@/lib/constants';
import { canSearchDataset, getDatasetByName, getDatasetCollections, getDatasetFileUrl, getDatasetsByScope, getRecentEntities } from '@/lib/data';
import { getGenerateMetadata } from '@/lib/meta';
import { getSchemaDataset } from '@/lib/schema';
import { IDataset, isCollection, isExternal, isSource } from '@/lib/types';
import { markdownToHtml } from '@/lib/util';

import styles from '@/styles/Dataset.module.scss';

interface DatasetPageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata(props: DatasetPageProps) {
  const params = await props.params;
  const dataset = await getDatasetByName(params.name);
  if (dataset === undefined) {
    return getGenerateMetadata({
      title: `Dataset not found`
    })
  }
  return getGenerateMetadata({
    title: dataset.title,
    description: dataset.summary,
    noIndex: dataset.hidden,
    canonicalUrl: `${BASE_URL}/datasets/${dataset.name}/`,
  })
}

// export async function generateStaticParams() {
//   const datasets = await getDatasets();
//   const collections = datasets.filter((d) => isCollection(d) && !d.hidden);
//   return collections.map((d) => ({ name: d.name }))
// }

export default async function Page(props: DatasetPageProps) {
  const params = await props.params;
  const dataset = await getDatasetByName(params.name);
  if (dataset === undefined) {
    notFound()
  }
  const statistics = await getDatasetStatistics(dataset);
  const allCollections = await getDatasetCollections(dataset);
  const collections = allCollections.filter((c) => !c.hidden);
  const canSearch = await canSearchDataset(dataset);
  const childDatasets = isCollection(dataset) ? await getDatasetsByScope(dataset.name) : [];
  const datasets = childDatasets.filter((ds) => !!ds && !ds.hidden && !isCollection(ds)) as IDataset[];

  const recents = !isSource(dataset) ? [] :
    await getRecentEntities(dataset);
  const markdown = await markdownToHtml(dataset.description || '');

  const fullDataset = dataset.full_dataset ? await getDatasetByName(dataset.full_dataset) : undefined;

  return (
    <LayoutFrame activeSection="datasets">
      <StructuredData data={getSchemaDataset(dataset)} />
      <Container className={styles.datasetPage}>
        <div className="d-flex justify-content-end gap-2">
          <JSONLink href={getDatasetFileUrl(dataset.name, 'index.json')} />

          {/* Button to view the dataset source on GitHub.
              Link to the search page because a dataset doesn't know its own source directory. */}
          <Button
            variant="outline-dark"
            size="sm"
            href={`https://github.com/search?q=repo%3Aopensanctions%2Fopensanctions+path%3A**%2F${dataset.name}.yml&type=code`}
          >
            <Github className="bsIcon" />
            {' '}GitHub
          </Button>

        </div>
        <h1>
          <Dataset.Icon dataset={dataset} size="30px" /> {dataset.title}
        </h1>
        <Row>
          <Col md={9}>
            <Summary summary={dataset.summary} />
            {params.name == "peps" && (
              <div className="alert alert-info" role="alert">
                <div>
                  <strong>Who is running the world?</strong> Collecting information about
                  PEPs is a complex task. We provide detailed information
                  on our <Link href="/pep/">global data coverage</Link> and
                  technical <Link href="/docs/pep/methodology/">methodology</Link>.
                </div>
              </div>
            )}
            <Markdown markdown={markdown} />
            {isExternal(dataset) && (
              <Alert variant="secondary">
                <AlertHeading>Enrichment-based dataset</AlertHeading>
                <p>
                  This dataset contains entities from a larger database
                  that is used to <Link href="/docs/enrichment/">enrich the data</Link> in
                  OpenSanctions with additional details and connections.

                  We only include entities from the source where there
                  is a relevant connection to the entities in the main OpenSanctions
                  database (e.g. to a sanctions target or a politician).
                </p>
                {fullDataset && (
                  <p>
                    <Button variant="secondary" href={fullDataset.link}>
                      View the full dataset
                    </Button>
                  </p>
                )}

              </Alert>
            )}
            <section>
              <h3>
                <a id="overview"></a>
                Data overview
              </h3>
              {!isExternal(dataset) && canSearch && (
                <Form className="d-flex d-print-none" action="/search/">
                  <input type="hidden" name="scope" value={dataset.name} />
                  <InputGroup className={styles.searchBox} size="lg">
                    <FormControl
                      type="search"
                      name="q"
                      autoFocus={true}
                      placeholder={`Search in ${dataset.title}...`}
                      aria-label={`Search inside of ${dataset.title}`}
                    />
                    <Button variant="secondary" type="submit">
                      <Search className="bsIcon" />{' '}
                      Search
                    </Button>
                  </InputGroup>
                </Form>
              )}
              <DatasetMetadataTable
                dataset={dataset}
                statistics={statistics}
                collections={collections}
                canSearch={canSearch}
              />
            </section>

            {dataset.resources && dataset.resources.length > 0 && !isExternal(dataset) && (
              <section>
                <h3>
                  <a id="download"></a>
                  Bulk download
                </h3>
                <p>
                  Downloads contain the full set of entities contained in this dataset. You can fetch
                  a simplified tabular form, or detailed, structured data in JSON format. Updated files
                  will be provided once a day at the same location.
                </p>
                <Table className={styles.downloadTable} size="sm">
                  <thead>
                    <tr>
                      <th className="numeric narrow"></th>
                      <th>File name</th>
                      <th>Export type</th>
                      <th className="numeric">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.resources.map((resource) =>
                      <tr key={resource.name}>
                        <td className="numeric narrow">
                          <a className="btn btn-dark btn-sm" rel="nofollow" download href={resource.url}>
                            <Download className="bsIcon" />
                          </a>
                        </td>
                        <td>
                          <a href={resource.url} rel="nofollow" download>
                            <code>{resource.name}</code>
                          </a>
                        </td>
                        <td>{resource.title}</td>
                        <td className="numeric">
                          <FileSize size={resource.size} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <p>
                  Help: <Link href="/docs/bulk/">Using the data</Link>
                  <Spacer />
                  <Link href="/reference/">model reference</Link>
                  <Spacer />
                  <Link href="/faq/80/bulk-deltas/">delta updates</Link>
                  <Spacer />
                  <Link href="/support/">support</Link>
                  <Spacer />
                  <Link href="/changelog/">change log</Link>
                  <Spacer />
                  <Link href="/licensing/">licensing</Link>
                </p>
              </section>
            )}

            {canSearch && (
              <section>
                <h3>
                  <a id="api"></a>
                  Using the API
                </h3>
                <p>
                  You can query the data in this dataset via the application programming
                  interface (API) endpoints below. Please <Link href="/api/">read
                    the introduction</Link> for documentation and terms of service.
                </p>
                <Table className={styles.apiTable}>
                  <tbody>
                    <tr>
                      <td width="40%">
                        Use the <a href={`${API_URL}/#tag/Reconciliation`}>Reconciliation API</a> in <Link href="https://openrefine.org/">OpenRefine</Link>:
                      </td>
                      <td width="60%">
                        <FormControl readOnly value={`${API_URL}/reconcile/${dataset.name}?api_key=YOUR_API_KEY`} />
                      </td>
                    </tr>
                    <tr>
                      <td width="40%">
                        For <a href={`${API_URL}/#operation/search_search__dataset__get`}>full-text search</a>, use the <code>/search</code> endpoint:
                      </td>
                      <td width="60%">
                        <FormControl readOnly value={`${API_URL}/search/${dataset.name}?q=John+Doe`} />
                      </td>
                    </tr>
                    <tr>
                      <td width="40%">
                        For <a href={`${API_URL}/#operation/match_match__dataset__post`}>entity matching</a>, use the <code>/match</code> endpoint:
                      </td>
                      <td width="60%">
                        <FormControl readOnly value={`${API_URL}/match/${dataset.name}`} />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </section>
            )}

            {isCollection(dataset) && !!datasets?.length && (
              <section>
                <h3>
                  <a id="sources"></a>
                  Data sources
                  <NumericBadge value={datasets.length} />
                </h3>
                <p>
                  <strong>{dataset.title}</strong> is a <Link href="/faq/21/collections">collection</Link> which
                  bundles together entities from {datasets.length} <Link href="/faq/21/datasets">data sources</Link>.
                  See the <Link href={`/datasets/sources/?scope=${dataset.name}`}>source browser</Link> for
                  more details...
                </p>
                <Dataset.Table datasets={datasets} />
              </section>
            )}
            {recents !== null && recents !== undefined && !!recents?.length && (
              <section>
                <h3>
                  <a id="recents"></a>
                  Recent additions
                </h3>
                <p>
                  The following targeted entities have been added to this data source most recently:
                </p>
                <Table>
                  <thead>
                    <tr>
                      <th>Added</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Countries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recents.map((r) =>
                      <tr key={r.id}>
                        <td>
                          <FormattedDate date={r.first_seen} />
                        </td>
                        <td>
                          <strong>
                            <Link prefetch={false} href={`/entities/${r.id}`}>{r.caption}</Link>
                          </strong>
                        </td>
                        <td>
                          <Badge bg="light">{r.schema}</Badge>
                        </td>
                        <td>
                          <SpacedList values={r.countries} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </section>
            )}
          </Col>
          <Col sm={3}>
            <Sticky>
              <Nav className="flex-column d-print-none">
                {!isExternal(dataset) && (
                  <>
                    <NavLink href="#overview">Overview</NavLink>
                    <NavLink href="#download">Download</NavLink>
                    <NavLink href="#api">API</NavLink>
                  </>
                )}
                {!!datasets?.length && (
                  <NavLink href="#sources">Data sources</NavLink>
                )}
                {!!recents?.length && (
                  <NavLink href="#recents">Recent additions</NavLink>
                )}
              </Nav>
              <LicenseInfo />
            </Sticky>
          </Col>
        </Row>
      </Container>
    </LayoutFrame >
  )
}
