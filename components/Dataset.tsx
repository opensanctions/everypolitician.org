import { FolderFill, NodePlusFill, Server } from 'react-bootstrap-icons';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';

import { IDataset, isCollection, isExternal } from '../lib/types';
import { Numeric } from './Formatting';

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

function DatasetIcon({ dataset }: { dataset: IDataset }) {
  if (isCollection(dataset)) {
    return <FolderFill className="bsIcon" />;
  }
  if (isExternal(dataset)) {
    return <NodePlusFill className="bsIcon" />;
  }
  return <Server className="bsIcon" />;
}

type DatasetProps = {
  dataset: IDataset;
};

export default function Dataset({ dataset }: DatasetProps) {
  return (
    <Card>
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
