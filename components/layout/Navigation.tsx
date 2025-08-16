import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { NavbarBrand, NavbarToggle, NavbarCollapse, Navbar, Nav, Container } from '../wrapped';

import styles from '../../styles/Navigation.module.scss';

type NavLinkProps = {
  active: boolean
  href: string
  children?: React.ReactNode
}


function NavLink({ active, href, children }: NavLinkProps) {
  const clazz = classNames("nav-link", styles.navItem, { [styles.active]: active });
  return <Link className={clazz} href={href} prefetch={false}>{children}</Link>
}


type NavbarSectionProps = {
  activeSection?: string
}

export default function Navigation({ activeSection }: NavbarSectionProps) {
  return (
    <Navbar expand="lg" className={styles.navBar} role="banner">
      <Container>
        <Link href="/" passHref>
          <NavbarBrand>
            <img
              src="https://assets.opensanctions.org/images/ura/logo_text.svg"
              width="190"
              height="30"
              className="align-top"
              alt="OpenSanctions"
            />
          </NavbarBrand>
        </Link>
        <NavbarToggle className={styles.navToggle} />
        <NavbarCollapse className="justify-content-end">
          <Nav
            className={classNames("justify-content-end", styles.nav)}
            variant="pills"
            role="navigation"
            aria-label="Site menu"
          >
            <NavLink href="/research/" active={activeSection === 'research'}>Research</NavLink>
            <NavLink href="/datasets/" active={activeSection === 'datasets'}>Datasets</NavLink>
            <NavLink href="/showcase/" active={activeSection === 'showcase'}>Showcase</NavLink>
            <NavLink href="/docs/" active={activeSection === 'docs'}>Documentation</NavLink>
            <NavLink href="/docs/about/" active={activeSection === 'about'}>About</NavLink>
          </Nav>
        </NavbarCollapse>
      </Container>
    </Navbar >
  )
}