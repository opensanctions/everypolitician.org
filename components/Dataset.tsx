import Link from 'next/link';
import { FolderFill, NodePlusFill, Server } from 'react-bootstrap-icons';

import { IDataset, IDatasetPublisher, isCollection, isExternal } from '@/lib/types';
import { FrequencyBadge } from './Metadata';
import Territory from './Territory';
import { Explain, FormattedDate, Numeric, NumericBadge, Spacer, UnofficialBadge } from './util';
import { Badge, Card, CardBody, CardSubtitle, CardText, Table } from "./wrapped";

import styles from '@/styles/Dataset.module.scss';


type DatasetProps = {
  dataset: IDataset
}

type DatasetIconProps = {
  dataset?: IDataset
  color?: string
  size?: string
}

function DatasetIcon({ dataset, ...props }: DatasetIconProps) {
  if (dataset === undefined) {
    return null;
  }
  if (isCollection(dataset)) {
    return <FolderFill className="bsIcon" {...props} />
  }
  if (isExternal(dataset)) {
    return <NodePlusFill className="bsIcon" {...props} />
  }
  return <Server className="bsIcon" {...props} />
}

function DatasetLink({ dataset, ...props }: DatasetIconProps) {
  if (dataset === undefined) {
    return null;
  }
  return (
    <a href={dataset.link}>
      <span><DatasetIcon dataset={dataset} {...props} /> {dataset.title}</span>
    </a>
  )
}

function DatasetPublisher({ publisher, short = true, country = false }: { publisher: IDatasetPublisher, short?: boolean, country?: boolean }) {
  const label = (short && publisher.acronym) ? <Explain tooltip={publisher.name}>{publisher.acronym}</Explain> : publisher.name;
  return <>{label} {country && publisher.country && <Territory.Badge territory={publisher.territory} />}</>;
}


function DatasetCard({ dataset }: DatasetProps) {
  return (
    <Card key={dataset.name} className={styles.card}>
      <CardBody>
        <h4 className={styles.cardTitle}>
          <DatasetLink dataset={dataset} />
        </h4>
        <CardSubtitle className="mb-2 text-muted">
          <Numeric value={dataset.thing_count} /> entities
          {!!dataset.publisher && (
            <>
              <Spacer />
              {dataset.publisher.country_label && (
                <>{dataset.publisher.country_label}</>
              )}
              {!dataset.publisher.official && (
                <>
                  <Spacer />
                  <UnofficialBadge />
                </>
              )}
            </>
          )}

        </CardSubtitle>
        <CardText>
          {dataset.summary}
        </CardText>
      </CardBody>
    </Card>
  )
}


function DatasetItem({ dataset }: DatasetProps) {
  return (
    <Card key={dataset.name} className={styles.item}>
      <CardBody>
        <a href={dataset.link} className={styles.itemHeader}>
          <DatasetIcon dataset={dataset} /> {dataset.title}
          <NumericBadge value={dataset.thing_count} className={styles.itemTargets} />
        </a>
        <p className={styles.itemSummary}>
          {dataset.summary}
        </p>
        <p className={styles.itemDetails}>
          {isCollection(dataset) && (
            <>
              <Badge bg="light">Collection</Badge>
            </>
          )}
          {!!dataset.publisher && (
            <>
              {isExternal(dataset) && (
                <>
                  <Badge bg="light">External dataset</Badge>
                  <Spacer />
                </>
              )}
              {dataset.publisher.country_label && (
                <>
                  <Badge bg="light">{dataset.publisher.country_label}</Badge>
                  <Spacer />
                </>
              )}
              <DatasetPublisher publisher={dataset.publisher} country={false} />
              {!dataset.publisher.official && (
                <>
                  <Spacer />
                  <UnofficialBadge />
                </>
              )}
            </>
          )}
        </p>
      </CardBody>
    </Card>
  )
}

interface DatasetTableConfig {
  icon?: boolean
  publisher?: boolean
  country?: boolean
  frequency?: boolean
  dateAdded?: boolean
}

interface DatasetTableRowProps extends DatasetTableConfig {
  dataset: IDataset
}

function DatasetTableRow({ dataset, icon, publisher, country, frequency, dateAdded }: DatasetTableRowProps) {
  return (
    <>
      <tr>
        {icon && (
          <td rowSpan={1}>
            <DatasetIcon dataset={dataset} />
          </td>
        )}
        <td colSpan={2}>
          <Link href={dataset.link} prefetch={false}>{dataset.title}</Link>
        </td>
        {publisher && (
          <td>
            {!!dataset.publisher && (
              <>
                <DatasetPublisher publisher={dataset.publisher} short />
                {!dataset.publisher.official && (
                  <>&nbsp;<UnofficialBadge short /></>
                )}
              </>
            )}
          </td>
        )}
        {country && (
          <td>
            {!!dataset.publisher && (
              <Territory.Badge territory={dataset.publisher.territory} />
            )}
          </td>
        )}
        {frequency && (
          <td rowSpan={1}>
            {!!dataset.coverage && (
              <FrequencyBadge coverage={dataset.coverage} hideNever />
            )}
          </td>
        )}
        {dateAdded && (
          <td rowSpan={1}>
            {!!dataset.coverage && (
              <FormattedDate date={dataset.coverage.start} />
            )}
          </td>
        )}
        <td className='numeric' rowSpan={1}>
          <Numeric value={dataset.thing_count} />
        </td>
      </tr>
    </>
  );
}

interface DatasetsTableProps extends DatasetTableConfig {
  datasets: Array<IDataset>
}

function DatasetsTable({ datasets, icon = true, publisher = false, country = true, frequency = false, dateAdded = false }: DatasetsTableProps) {
  return (
    <Table size="sm" responsive>
      <thead>
        <tr>
          <th colSpan={icon ? 3 : 2}>Name</th>
          {publisher && (
            <th>Publisher</th>
          )}
          {country && (
            <th>Country</th>
          )}
          {frequency && (
            <th>Updates</th>
          )}
          {dateAdded && (
            <th>Date added</th>
          )}
          <th className="numeric">Entities</th>
        </tr>
      </thead>
      <tbody>
        {datasets.map(dataset =>
          <DatasetTableRow
            key={dataset.name}
            dataset={dataset}
            icon={icon}
            publisher={publisher}
            country={country}
            frequency={frequency}
            dateAdded={dateAdded} />
        )}
      </tbody>
    </Table >
  )
}

export default class Dataset {
  static Card = DatasetCard
  static Item = DatasetItem
  static Table = DatasetsTable
  static Icon = DatasetIcon
  static Link = DatasetLink
}