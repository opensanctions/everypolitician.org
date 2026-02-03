'use client';

import { useState } from 'react';
import Table from 'react-bootstrap/Table';

import { EntityData, getFirst, getStringProperty } from '@/lib/types';

type PersonProfileProps = {
  person: EntityData;
};

const DEFAULT_MAX_ITEMS = 5;

function ExpandableList({
  items,
  maxItems = DEFAULT_MAX_ITEMS,
}: {
  items: string[];
  maxItems?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) {
    return null;
  }

  if (items.length <= maxItems) {
    return <>{items.join(', ')}</>;
  }

  if (expanded) {
    return (
      <>
        {items.join(', ')}{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setExpanded(false);
          }}
        >
          show less
        </a>
      </>
    );
  }

  return (
    <>
      {items.slice(0, maxItems).join(', ')}{' '}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setExpanded(true);
        }}
      >
        show all ({items.length})
      </a>
    </>
  );
}

function UnknownValue() {
  return (
    <span className="text-muted fst-italic">
      unknown - <a href="/about/contribute/">help add it</a>
    </span>
  );
}

export default function PersonProfile({ person }: PersonProfileProps) {
  const aliases = getStringProperty(person, 'alias');
  const classification = getStringProperty(person, 'classification');
  const education = getStringProperty(person, 'education');
  const political = getStringProperty(person, 'political');

  const profileProperties = [
    {
      label: 'Also known as',
      value:
        aliases.length > 0 ? (
          <ExpandableList items={aliases} maxItems={10} />
        ) : null,
    },
    { label: 'Date of birth', value: getFirst(person, 'birthDate') },
    { label: 'Place of birth', value: getFirst(person, 'birthPlace') },
    {
      label: 'Classification',
      value:
        classification.length > 0 ? (
          <ExpandableList items={classification} />
        ) : null,
    },
    {
      label: 'Education',
      value: education.length > 0 ? <ExpandableList items={education} /> : null,
    },
    {
      label: 'Political affiliation',
      value: political.length > 0 ? <ExpandableList items={political} /> : null,
    },
  ];

  return (
    <Table>
      <tbody>
        {profileProperties.map(({ label, value }) => (
          <tr key={label}>
            <th style={{ minWidth: '10rem' }}>{label}</th>
            <td style={{ minWidth: '60%' }}>{value ?? <UnknownValue />}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
