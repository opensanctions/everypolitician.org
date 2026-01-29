'use client';

import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PersonProfile from '@/components/PersonProfile';
import OccupanciesTable from '@/components/OccupanciesTable';

export default function PoliticianShowcase({ persons }: { persons: any[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = persons[selectedIndex] ?? null;
  const occupancies = selected?.adjacent.positionOccupancies?.results ?? [];

  return (
    <Container>
      <Row className="py-5 my-5">
        <Col md={4}>
          <h3>What&apos;s a politician?</h3>
          <p>
            Anyone holding public authority: presidents, legislators, judges,
            senior officials, and military commanders.
          </p>
          {persons.length > 0 && (
            <>
              <p>Here are some examples to get a feel for the data.</p>
              <ul>
                {persons.map((person, index) => (
                  <li key={person.entity.id}>
                    <a
                      href="#"
                      className={index === selectedIndex ? 'fw-bold' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedIndex(index);
                      }}
                    >
                      {person.entity.caption}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Col>
        {selected && (
          <Col md={8}>
            <h3>
              <a href={`/persons/${selected.entity.id}/`}>
                {selected.entity.caption}
              </a>
            </h3>
            <PersonProfile person={selected.entity} />
            <OccupanciesTable occupancies={occupancies} />
          </Col>
        )}
      </Row>
    </Container>
  );
}
