import { BoxArrowUpRight } from 'react-bootstrap-icons';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import CardTitle from 'react-bootstrap/CardTitle';

import { IDataset } from '../lib/types';

type DatasetProps = {
  dataset: IDataset;
};

export default function Dataset({ dataset }: DatasetProps) {
  return (
    <Card>
      <CardBody>
        <CardTitle>{dataset.title}</CardTitle>
        <p className="text-muted">{dataset.summary}</p>
        {dataset.type === 'collection' && <Badge bg="light">Collection</Badge>}
        <a href={dataset.link} target="_blank" rel="noopener noreferrer">
          View on OpenSanctions <BoxArrowUpRight />
        </a>
      </CardBody>
    </Card>
  );
}
