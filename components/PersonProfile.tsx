'use client';

import { useState } from 'react';
import Table from 'react-bootstrap/Table';

import { EntityData, getFirst, getStringProperty } from '@/lib/types';

type PersonProfileProps = {
  person: EntityData;
  familyMembers?: string[];
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

export default function PersonProfile({
  person,
  familyMembers = [],
}: PersonProfileProps) {
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
    {
      label: 'Date of birth',
      value: getFirst(person, 'birthDate'),
      required: true,
    },
    {
      label: 'Place of birth',
      value: getFirst(person, 'birthPlace'),
      required: true,
    },
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
    {
      label: 'Family',
      value:
        familyMembers.length > 0 ? (
          <ExpandableList items={familyMembers} />
        ) : null,
    },
  ];

  const visibleProperties = profileProperties.filter(
    ({ value, required }) => value || required,
  );

  return (
    <Table>
      <tbody>
        {visibleProperties.map(({ label, value, required }) => (
          <tr key={label}>
            <th style={{ minWidth: '10rem' }}>{label}</th>
            <td style={{ minWidth: '60%' }}>
              {value ?? (required ? <UnknownValue /> : null)}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
