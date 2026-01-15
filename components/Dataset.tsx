import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';

import { IDataset } from '../lib/types';
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
          {dataset.title}
          <NumericBadge value={dataset.thing_count} className="float-end" />
        </a>
        <p className="text-muted">{dataset.summary}</p>
        {dataset.type === 'collection' && (
          <p>
            <Badge bg="light">Collection</Badge>
          </p>
        )}
      </CardBody>
    </Card>
  );
}
