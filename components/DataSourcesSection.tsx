import Link from 'next/link';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BoxArrowUpRight } from 'react-bootstrap-icons';

import type { Dataset } from '../lib/types';

type DataSourcesSectionProps = {
  datasets: Dataset[];
};

export default function DataSourcesSection({
  datasets,
}: DataSourcesSectionProps) {
  return (
    <section id="sources" className="mb-5">
      <Row>
        <Col md={8}>
          <h2>Sources</h2>
          <p>
            Most of the data on this site comes from Wikidata. We are also
            working to bring in primary source data for verification.{' '}
            <Link href="/sources/">Learn more about our data sources</Link>.
          </p>
          <ul>
            {datasets.map((dataset) => (
              <li key={dataset.name}>
                <a
                  href={dataset.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dataset.title} <BoxArrowUpRight size={12} />
                </a>
                {dataset.publisher?.official && (
                  <Badge className="ms-2">Official</Badge>
                )}
                {dataset.summary && <p>{dataset.summary}</p>}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </section>
  );
}
