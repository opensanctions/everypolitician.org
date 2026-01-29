import Link from 'next/link';
import Table from 'react-bootstrap/Table';

import { EntityData, getFirst, getEntityProperty } from '@/lib/types';

type OccupanciesTableProps = {
  occupancies: EntityData[];
};

export default function OccupanciesTable({
  occupancies,
}: OccupanciesTableProps) {
  if (occupancies.length === 0) {
    return <p className="text-muted mb-0">No positions held.</p>;
  }

  return (
    <Table size="sm">
      <thead>
        <tr>
          <th>Position</th>
          <th className="text-end">Start</th>
          <th className="text-end">End</th>
        </tr>
      </thead>
      <tbody>
        {occupancies.map((occupancy) => {
          const post = getEntityProperty(occupancy, 'post')[0];
          return (
            <tr key={occupancy.id}>
              <td>
                {post ? (
                  <Link href={`/positions/${post.id}/`}>{post.caption}</Link>
                ) : (
                  '-'
                )}
              </td>
              <td className="text-end">
                {getFirst(occupancy, 'startDate') || '-'}
              </td>
              <td className="text-end">
                {getFirst(occupancy, 'endDate') || '-'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
