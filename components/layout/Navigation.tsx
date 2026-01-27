'use client';

import Link from 'next/link';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavLink from 'react-bootstrap/NavLink';
import Navbar from 'react-bootstrap/Navbar';

type NavbarSectionProps = {
  activeSection?: string;
};

export default function Navigation({ activeSection }: NavbarSectionProps) {
  return (
    <Navbar expand="lg" role="banner" className="my-1">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>
            <img
              src="https://assets.opensanctions.org/images/ep/logo-oneline-color.svg"
              width="190"
              height="30"
              className="align-top"
              alt="OpenSanctions"
            />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav
            className="justify-content-end"
            variant="pills"
            role="navigation"
            aria-label="Site menu"
          >
            <NavLink
              as={Link}
              href="/regions/"
              active={activeSection === 'territories'}
              className="fw-bold ms-3"
            >
              Regions
            </NavLink>
            <NavLink
              as={Link}
              href="/datasets/"
              active={activeSection === 'datasets'}
              className="fw-bold ms-3"
            >
              Datasets
            </NavLink>
            <NavLink
              as={Link}
              href="/docs/"
              active={activeSection === 'docs'}
              className="fw-bold ms-3"
            >
              Documentation
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
