import Link from 'next/link';

import { Numeric } from '@/components/Formatting';
import LayoutFrame from '@/components/layout/LayoutFrame';
import Territory from '@/components/Territory';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { getDatasetsByScope } from '@/lib/data';
import { isSource } from '@/lib/types';
import { getGenerateMetadata } from '@/lib/meta';
import { BASE_URL } from '@/lib/constants';

export const dynamic = 'force-static';

export async function generateMetadata() {
  return getGenerateMetadata({
    title: 'PEP Data Sets - EveryPolitician',
    description:
      'Browse all PEP-relevant data sources used by EveryPolitician.',
    canonicalUrl: `${BASE_URL}/datasets/`,
  });
}

export default async function Page() {
  const datasets = await getDatasetsByScope('peps');
  const sources = datasets.filter((ds) => !ds.hidden).filter(isSource);

  return (
    <LayoutFrame activeSection="datasets">
      <Container className="content-area">
        <Row>
          <Col md={9}>
            <h1>PEP Data Sets</h1>
            <p>
              These are the data sources used by EveryPolitician to compile
              information about politically exposed persons.
            </p>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Country</th>
                  <th className="text-end">Entities</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((dataset) => (
                  <tr key={dataset.name}>
                    <td>
                      <Link href={dataset.link} prefetch={false}>
                        {dataset.title}
                      </Link>
                    </td>
                    <td>
                      {dataset.publisher && (
                        <Territory.Badge
                          territory={dataset.publisher.territory}
                        />
                      )}
                    </td>
                    <td className="text-end">
                      <Numeric value={dataset.thing_count} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  );
}
