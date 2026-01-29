'use client';

import { useState } from 'react';
import Table from 'react-bootstrap/Table';

import { EntityData, getFirst, getStringProperty } from '@/lib/types';

type PersonProfileProps = {
  person: EntityData;
};

const MAX_ALIASES_SHOWN = 20;

function AliasesValue({ aliases }: { aliases: string[] }) {
  const [expanded, setExpanded] = useState(false);

  if (aliases.length <= MAX_ALIASES_SHOWN) {
    return <>{aliases.join(', ')}</>;
  }

  if (expanded) {
    return (
      <>
        {aliases.join(', ')}{' '}
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
      {aliases.slice(0, MAX_ALIASES_SHOWN).join(', ')}{' '}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setExpanded(true);
        }}
      >
        show all ({aliases.length})
      </a>
    </>
  );
}

export default function PersonProfile({ person }: PersonProfileProps) {
  const aliases = getStringProperty(person, 'alias');

  const profileProperties = [
    {
      label: 'Also known as',
      value: aliases.length > 0 ? <AliasesValue aliases={aliases} /> : null,
    },
    { label: 'Date of birth', value: getFirst(person, 'birthDate') },
    { label: 'Place of birth', value: getFirst(person, 'birthPlace') },
    {
      label: 'Political affiliation',
      value: getStringProperty(person, 'political').join(', ') || null,
    },
  ].filter((p) => p.value);

  if (profileProperties.length === 0) {
    return null;
  }

  return (
    <Table size="sm">
      <tbody>
        {profileProperties.map(({ label, value }) => (
          <tr key={label}>
            <th style={{ minWidth: '10rem' }}>{label}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
