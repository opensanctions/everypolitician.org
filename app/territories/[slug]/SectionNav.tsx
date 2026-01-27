'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Nav from 'react-bootstrap/Nav';
import { PositionSectionDefinition } from './positionDefinitions';

type SectionNavProps = {
  countryCode: string;
  visibleSections: PositionSectionDefinition[];
};

export function SectionNav({ countryCode, visibleSections }: SectionNavProps) {
  const pathname = usePathname();

  return (
    <Nav variant="tabs" className="mb-3">
      {visibleSections.map((section) => {
        const href = `/territories/${countryCode}/${section.name}/`;
        const isActive = pathname === href;
        return (
          <Nav.Item key={section.name}>
            <Nav.Link as={Link} href={href} active={isActive}>
              {section.navLabel}
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
}
