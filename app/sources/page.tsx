import Link from 'next/link';

import LayoutFrame from '@/components/layout/LayoutFrame';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { getDatasetsByScope } from '@/lib/data';

import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Data Sources – EveryPolitician',
  description:
    'Browse the official sources used by EveryPolitician to compile information about political office-holders.',
  alternates: { canonical: '/sources/' },
};

export default async function Page() {
  const datasets = await getDatasetsByScope('peps');
  const sources = datasets.filter((ds) => !ds.hidden && ds.type === 'source');

  return (
    <LayoutFrame activeSection="sources">
      <Container className="py-4 mb-5">
        <h1>Data Sources</h1>
        <p>
          These are the sources used by EveryPolitician to compile information
          about political office-holders around the world.
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
                  {dataset.publisher?.territory && (
                    <Link
                      href={`/territories/${dataset.publisher.territory.code}/national/`}
                      prefetch={false}
                    >
                      <Badge bg="primary">
                        {dataset.publisher.territory.name}
                      </Badge>
                    </Link>
                  )}
                </td>
                <td className="text-end">{dataset.thing_count || '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </LayoutFrame>
  );
}
