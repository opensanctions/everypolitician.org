'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavLink from 'react-bootstrap/NavLink';
import Navbar from 'react-bootstrap/Navbar';

const NAV_ITEMS = [
  { href: '/regions/', label: 'Research' },
  { href: '/sources/', label: 'Sources' },
  {
    href: '/about/',
    label: 'About',
    mobileSubItems: [{ href: '/about/methodology/', label: 'Methodology' }],
  },
  {
    href: '/about/contribute/',
    label: 'Contribute',
    cta: true,
    mobileSubItems: [
      { href: '/about/contribute/poliloom/', label: 'Using PoliLoom' },
      { href: '/about/contribute/wikidata/', label: 'Editing Wikidata' },
    ],
  },
];

export default function Navigation() {
  const pathname = usePathname();

  // Find the longest matching href to handle nested paths correctly
  const activeHref = NAV_ITEMS.filter((item) =>
    pathname.startsWith(item.href),
  ).sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <Navbar expand="lg" collapseOnSelect role="banner" className="my-1">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>
            <Image
              src="https://assets.opensanctions.org/images/ep/logo-oneline-color.svg"
              width={190}
              height={30}
              className="align-top"
              alt="OpenSanctions"
            />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav
            className="justify-content-end gap-lg-2"
            variant="pills"
            role="navigation"
            aria-label="Site menu"
          >
            {NAV_ITEMS.map((item) => (
              <span key={item.href}>
                <NavLink
                  as={Link}
                  href={item.href}
                  active={activeHref === item.href}
                  className={`fw-bold${item.cta ? ' nav-cta' : ''}`}
                >
                  {item.label}
                </NavLink>
                {item.mobileSubItems?.map((subItem) => (
                  <NavLink
                    key={subItem.href}
                    as={Link}
                    href={subItem.href}
                    active={pathname === subItem.href}
                    className="d-lg-none ps-4"
                  >
                    {subItem.label}
                  </NavLink>
                ))}
              </span>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
