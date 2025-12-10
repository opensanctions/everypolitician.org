'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Numeric, Spacer } from '@/components/util';
import { IPositionSummary } from '@/lib/peps';

import { HelpLink } from './clientUtil';

const PAGE_LIMIT = 100;

function positionRows(positions: IPositionSummary[], limit: number) {
  const collapsedPositions = positions.slice(0, limit);
  return collapsedPositions.map((position: IPositionSummary) => {
    return (
      <tr key={position.id}>
        <td>
          <Link prefetch={false} href={`/positions/${position.id}/`}>
            {bestLabel(position.names)}
          </Link>
        </td>
        <td className="numeric d-none d-md-table-cell">
          <Numeric value={position.counts.current} />
        </td>
        <td className="numeric d-none d-md-table-cell">
          <Numeric value={position.counts.ended} />
        </td>
        <td className="numeric d-none d-md-table-cell">
          <Numeric value={position.counts.unknown} />
        </td>
      </tr>
    );
  });
}

function bestLabel(labels: string[]) {
  const isTitlecase = /^[A-Z]\w*/;
  for (const label of labels) {
    if (isTitlecase.exec(label) !== null) return label;
  }
  return labels[0];
}

type PEPSubsectionDefinition = {
  name: string;
  label: string;
};

export type PEPSectionDefinition = {
  name: string;
  label: string;
  navLabel: string;
  subsections: PEPSubsectionDefinition[];
  showIfEmpty: boolean;
};

type PEPSubsectionProps = {
  subsectionDefinition: PEPSubsectionDefinition;
  positions: IPositionSummary[];
  countryCode: string;
  hardLimit: number;
};

export function PEPSubsection({
  subsectionDefinition,
  positions,
  countryCode,
  hardLimit,
}: PEPSubsectionProps) {
  const [limit, setLimit] = useState(PAGE_LIMIT);
  const isEmpty = positions == undefined || positions.length == 0;
  return (
    isEmpty || (
      <tbody key={subsectionDefinition.name}>
        <tr>
          <th>{subsectionDefinition.label}</th>
          <th className="numeric d-none d-md-table-cell">Current</th>
          <th className="numeric d-none d-md-table-cell">Ended</th>
          <th className="numeric d-none d-md-table-cell text-nowrap">
            Status unclear
            <HelpLink href="#explain-status-unclear" tooltipId="status-unclear">
              When we can not determine whether a person currently holds a
              position from our data source(s) with sufficient confidence, we
              indicate its status as unclear.
            </HelpLink>
          </th>
        </tr>
        {...positionRows(positions, limit)}
        {positions.length > limit && limit < hardLimit && (
          <tr>
            <td colSpan={4}>
              <button
                className="btn btn-link"
                onClick={() => setLimit(limit + PAGE_LIMIT)}
              >
                Show more
              </button>
              <Spacer />
              <button
                className="btn btn-link"
                onClick={() => setLimit(hardLimit)}
              >
                Show all
              </button>
            </td>
          </tr>
        )}
        {positions.length > hardLimit && limit == hardLimit && (
          <tr>
            <td colSpan={4}>
              You&apos;ve reached the maximum number of positions we can show on
              this page but even more are available. Access the data in JSON
              format in the{' '}
              <a href="https://opensanctions.org/datasets/peps/#download">
                pep-positions.json file of the PEPs dataset
              </a>
              .
            </td>
          </tr>
        )}
      </tbody>
    )
  );
}
