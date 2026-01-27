'use client';

import Link from 'next/link';
import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

type NavLinkProps = {
  active: boolean;
  href: string;
  children?: React.ReactNode;
};

function NavLink({ active, href, children }: NavLinkProps) {
  const clazz = `nav-link nav-item-custom rounded ${active ? 'active' : ''}`;
  return (
    <Link className={clazz} href={href} prefetch={false}>
      {children}
    </Link>
  );
}

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
            <NavLink href="/regions/" active={activeSection === 'territories'}>
              Regions
            </NavLink>
            <NavLink href="/datasets/" active={activeSection === 'datasets'}>
              Datasets
            </NavLink>
            <NavLink href="/docs/" active={activeSection === 'docs'}>
              Documentation
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
