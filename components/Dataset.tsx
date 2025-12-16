import Link from 'next/link';
import { FolderFill, NodePlusFill, Server } from 'react-bootstrap-icons';

import {
  IDataset,
  IDatasetCoverage,
  isCollection,
  isExternal,
} from '../lib/types';

import { FormattedDate, Numeric } from './Formatting';
import Territory from './Territory';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import Table from 'react-bootstrap/Table';

function NumericBadge({
  value,
  className,
}: {
  value?: number | null;
  className?: string;
}) {
  return (
    <Badge bg="dark" className={className}>
      <Numeric value={value} />
    </Badge>
  );
}

function FrequencyBadge({
  coverage,
  hideNever = false,
}: {
  coverage?: IDatasetCoverage;
  hideNever?: boolean;
}) {
  if (!coverage || !coverage.frequency || coverage.frequency == 'unknown') {
    return null;
  }
  if (coverage.frequency == 'never') {
    if (hideNever) {
      return null;
    }
    return <Badge bg="warning">not automated</Badge>;
  }
  return <Badge bg="light">{coverage.frequency}</Badge>;
}

type DatasetProps = {
  dataset: IDataset;
};

type DatasetIconProps = {
  dataset?: IDataset;
  color?: string;
  size?: string;
};

function DatasetIcon({ dataset, ...props }: DatasetIconProps) {
  if (dataset === undefined) {
    return null;
  }
  if (isCollection(dataset)) {
    return <FolderFill className="bsIcon" {...props} />;
  }
  if (isExternal(dataset)) {
    return <NodePlusFill className="bsIcon" {...props} />;
  }
  return <Server className="bsIcon" {...props} />;
}

function DatasetLink({ dataset, ...props }: DatasetIconProps) {
  if (dataset === undefined) {
    return null;
  }
  return (
    <a href={dataset.link}>
      <span>
        <DatasetIcon dataset={dataset} {...props} /> {dataset.title}
      </span>
    </a>
  );
}

function DatasetItem({ dataset }: DatasetProps) {
  return (
    <Card key={dataset.name}>
      <CardBody>
        <a
          href={dataset.link}
          className="fw-bold d-block text-decoration-none fs-5"
        >
          <DatasetIcon dataset={dataset} /> {dataset.title}
          <NumericBadge value={dataset.thing_count} className="float-end" />
        </a>
        <p className="text-muted">{dataset.summary}</p>
        <p>
          {isCollection(dataset) && <Badge bg="light">Collection</Badge>}
          {isExternal(dataset) && <Badge bg="light">External dataset</Badge>}
        </p>
      </CardBody>
    </Card>
  );
}

interface DatasetTableConfig {
  icon?: boolean;
  country?: boolean;
  frequency?: boolean;
  dateAdded?: boolean;
}

interface DatasetTableRowProps extends DatasetTableConfig {
  dataset: IDataset;
}

function DatasetTableRow({
  dataset,
  icon,
  country,
  frequency,
  dateAdded,
}: DatasetTableRowProps) {
  return (
    <tr>
      {icon && (
        <td>
          <DatasetIcon dataset={dataset} />
        </td>
      )}
      <td colSpan={2}>
        <Link href={dataset.link} prefetch={false}>
          {dataset.title}
        </Link>
      </td>
      {country && (
        <td>
          {!!dataset.publisher && (
            <Territory.Badge territory={dataset.publisher.territory} />
          )}
        </td>
      )}
      {frequency && (
        <td>
          {!!dataset.coverage && (
            <FrequencyBadge coverage={dataset.coverage} hideNever />
          )}
        </td>
      )}
      {dateAdded && (
        <td>
          {!!dataset.coverage && (
            <FormattedDate date={dataset.coverage.start} />
          )}
        </td>
      )}
      <td className="text-end">
        <Numeric value={dataset.thing_count} />
      </td>
    </tr>
  );
}

interface DatasetsTableProps extends DatasetTableConfig {
  datasets: Array<IDataset>;
}

function DatasetsTable({
  datasets,
  icon = true,
  country = true,
  frequency = false,
  dateAdded = false,
}: DatasetsTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th colSpan={icon ? 3 : 2}>Name</th>
          {country && <th>Country</th>}
          {frequency && <th>Updates</th>}
          {dateAdded && <th>Date added</th>}
          <th className="text-end">Entities</th>
        </tr>
      </thead>
      <tbody>
        {datasets.map((dataset) => (
          <DatasetTableRow
            key={dataset.name}
            dataset={dataset}
            icon={icon}
            country={country}
            frequency={frequency}
            dateAdded={dateAdded}
          />
        ))}
      </tbody>
    </Table>
  );
}

export default class Dataset {
  static Item = DatasetItem;
  static Table = DatasetsTable;
  static Icon = DatasetIcon;
  static Link = DatasetLink;
}
