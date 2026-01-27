'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Nav from 'react-bootstrap/Nav';

type RegionsNavProps = {
  regions: string[];
};

export function RegionsNav({ regions }: RegionsNavProps) {
  const pathname = usePathname();

  return (
    <Nav variant="tabs" className="mb-3">
      <Nav.Item>
        <Nav.Link as={Link} href="/regions/" active={pathname === '/regions/'}>
          Overview
        </Nav.Link>
      </Nav.Item>
      {regions.map((region) => {
        const href = `/regions/${region.toLowerCase()}/`;
        const isActive = pathname === href;
        return (
          <Nav.Item key={region}>
            <Nav.Link as={Link} href={href} active={isActive}>
              {region}
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
}
