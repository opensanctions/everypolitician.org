import Link from 'next/link';

import { IDatasetStatistics } from '@/lib/datasets';
import { ICollection, IDataset, isCollection, isExternal, isSource } from '@/lib/types';
import { cronText, markdownToHtml, wordList } from '@/lib/util';
import DatasetCountryListing from './DatasetCountryListing';
import { FrequencyBadge } from './Metadata';
import Territory from './Territory';
import { FormattedDate, HelpLink, Markdown, Numeric, Plural, SpacedList, Spacer, UnofficialBadge, URLLink } from './util';
import { Badge, Table } from "./wrapped";

import styles from '@/styles/Dataset.module.scss';


type DatasetScreenProps = {
  dataset: IDataset
  statistics: IDatasetStatistics
  canSearch: boolean
  collections?: Array<ICollection>
}

export default async function DatasetMetadataTable({ dataset, statistics, collections, canSearch }: DatasetScreenProps) {
  const publisherDescription = await markdownToHtml(dataset.publisher?.description || '')
  return (
    <Table responsive="md">
      <tbody>
        <tr>
          <th className={styles.tableHeader}>
            Entities<HelpLink href="/faq/19/entities/" />:
          </th>
          <td className="contains-inner-table">
            <Table size="sm" className="inner-table">
              <tbody>
                <tr>
                  <td>Total</td>
                  <td className='numeric'>
                    <Numeric value={dataset.entity_count} />
                  </td>
                </tr>
                {statistics.things.total > 0 && canSearch && (
                  <tr>
                    <td>
                      Searchable
                      <HelpLink href={`/reference/#schema.Thing`} />
                    </td>
                    <td className='numeric'>
                      <a href={`/search/?scope=${dataset.name}`}>
                        <Numeric value={statistics.things.total} />
                      </a>
                    </td>
                  </tr>
                )}
                {!!dataset.target_count && dataset.target_count > 0 && (
                  <tr>
                    <td>
                      Targets
                      <HelpLink href="/faq/23/targets/" />
                    </td>
                    <td className='numeric'>
                      <Numeric value={dataset.target_count} />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </td>

        </tr>
        {statistics.things.schemata.length > 0 && (
          <tr>
            <th className={styles.tableHeader}>
              Entity types:
            </th>
            <td className="contains-inner-table">
              <Table size="sm" className="inner-table">
                <tbody>
                  {statistics.things.schemata.map((ts) =>
                    <tr key={ts.name}>
                      <td>
                        {canSearch && (
                          <a href={`/search/?scope=${dataset.name}&schema=${ts.name}`}>
                            <Plural one={ts.label} many={ts.plural} />
                          </a>
                        )}
                        {!canSearch && (
                          <Plural one={ts.label} many={ts.plural} />
                        )}
                        <HelpLink href={`/reference/#schema.${ts.name}`} />
                      </td>
                      <td className="numeric">
                        <Numeric value={ts.count} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </td>
          </tr>
        )}
        {statistics.things.countries.length > 0 && (
          <tr>
            <th className={styles.tableHeader}>
              Countries:
            </th>
            <td className="contains-inner-table">
              <DatasetCountryListing countries={statistics.things.countries} datasetName={dataset.name} />
            </td>
          </tr>
        )}
        {!!dataset.publisher && (
          <tr>
            <th className={styles.tableHeader}>Publisher:</th>
            <td>
              {dataset.publisher.logo_url &&
                <img
                  src={dataset.publisher.logo_url}
                  className={styles.publisherLogo}
                  alt={`Logo of ${dataset.publisher.name}`}
                />
              }
              <URLLink url={dataset.publisher.url} label={dataset.publisher.name} icon={false} />
              {!!dataset.publisher.acronym && (
                <> ({dataset.publisher?.acronym})</>
              )}
              {!!dataset.publisher.territory && (
                <> <Spacer /><Territory.Link territory={dataset.publisher.territory} /></>
              )}
              {!dataset.publisher.official && (
                <>{' '} <UnofficialBadge /></>
              )}
              <Markdown className={styles.publisherDescription} markdown={publisherDescription} />
            </td>
          </tr>
        )}
        {(isSource(dataset) || isExternal(dataset)) && !!collections?.length && (
          <tr>
            <th className={styles.tableHeader}>
              Collections<HelpLink href="/faq/21/collections/" />:
            </th>
            <td>
              <>in </>
              {wordList(collections.map((collection) =>
                <Link key={collection.name} href={collection.link}>
                  {collection.title}
                </Link>
              ), <Spacer />)}
            </td>
          </tr>
        )}
        {!!dataset.url && (
          <tr>
            {dataset.url && (
              <>
                <th className={styles.tableHeader}>Information:</th>
                <td>
                  <URLLink url={dataset.url} />
                </td>
              </>
            )}
          </tr>
        )}
        {!isCollection(dataset) && dataset.data?.url && (
          <tr>
            <th className={styles.tableHeader}>Source data:</th>
            <td colSpan={dataset.url ? 1 : 3}>
              <URLLink url={dataset.data.url} />
              {dataset.data.format && (
                <>
                  <Spacer />
                  <Badge bg="light">{dataset.data.format}</Badge>
                </>
              )}
            </td>
          </tr>
        )}
        {!!dataset.tags && dataset.tags.length > 0 && (
          <tr>
            <th className={styles.tableHeader}>
              Tags<HelpLink href="/docs/metadata/#tags" />:
            </th>
            <td>
              <SpacedList values={dataset.tags.map((tag) => (
                <Badge key={tag} bg="light">
                  {tag}
                </Badge>
              ))} />
            </td>
          </tr>
        )}
        {!!dataset.coverage && (
          <tr>
            <th className={styles.tableHeader}>
              Coverage<HelpLink href="/faq/82/coverage/" />:
            </th>
            <td>
              {dataset.coverage.start && (
                <>added < FormattedDate date={dataset.coverage.start} /></>
              )}
              {dataset.coverage.end && (
                <>
                  <Spacer />
                  current until <FormattedDate date={dataset.coverage.end} />
                </>
              )}
              {!!dataset.coverage.frequency && dataset.coverage.frequency !== 'unknown' && (
                <>
                  <Spacer />
                  frequency: <FrequencyBadge coverage={dataset.coverage} />
                </>
              )}
              {!!dataset.coverage.schedule && dataset.coverage.frequency !== 'never' && (
                <>
                  <Spacer />
                  {cronText(dataset.coverage.schedule)}
                </>
              )}
            </td>
          </tr>
        )}
        {!!dataset.last_export && (
          <tr>
            <th className={styles.tableHeader}>Last processed<HelpLink href="/faq/4/update-frequency/" />:</th>
            <td>
              {dataset.last_export.replace('T', ' ')} &middot; v. <code>{dataset.version}</code>
            </td>
          </tr>
        )}
        {!!dataset.last_change && (
          <tr>
            <th className={styles.tableHeader}>
              Last change<HelpLink href="/faq/81/last-change/" />:
            </th>
            <td>
              <FormattedDate date={dataset.last_change} />
            </td>
          </tr>
        )}
        {(dataset.issue_levels.error && dataset.issue_levels.error && (
          <tr>
            <th className={styles.tableHeader}>Errors:</th>
            <td>
              <Link href={`/issues/${dataset.name}/`}>
                <Badge bg='danger'>
                  <Plural value={dataset.issue_levels.error} one="Error" many="Errors" />
                </Badge>
              </Link>
            </td>
          </tr>
        ))}
        {dataset.issue_levels.warning && dataset.issue_levels.warning > 0 && (
          <tr>
            <th className={styles.tableHeader}>Warnings:</th>
            <td>
              <Link href={`/issues/${dataset.name}/`}>
                <Badge bg='warning'>
                  <Plural value={dataset.issue_levels.warning} one="Warning" many="Warnings" />
                </Badge>
              </Link>
              {(!dataset.issue_levels.warning) && (
                <Badge bg='light'>no warnings</Badge>
              )}
            </td>
          </tr>
        )}
      </tbody>
    </Table >

  )
}
