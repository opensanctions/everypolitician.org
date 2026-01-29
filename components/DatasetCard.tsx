import { BoxArrowUpRight } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import CardTitle from 'react-bootstrap/CardTitle';

import type { Dataset } from '../lib/types';

type DatasetCardProps = {
  dataset: Dataset;
};

export default function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <Card className="mb-3">
      <CardBody>
        <CardTitle>
          <h5>{dataset.title}</h5>
        </CardTitle>
        <p className="text-muted">{dataset.summary}</p>
        <a href={dataset.link} target="_blank" rel="noopener noreferrer">
          View on OpenSanctions <BoxArrowUpRight />
        </a>
      </CardBody>
    </Card>
  );
}
