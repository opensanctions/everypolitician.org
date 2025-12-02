
import { BoxArrowUpRight } from "react-bootstrap-icons";

import { LicenseInfo } from './Policy';
import { RoutedNavLink } from './util';
import { Nav, NavItem } from "./wrapped";


export type MenuProps = {
  path: string
}

export function AboutMenu({ path }: MenuProps) {
  return (
    <>
      <Nav className="flex-column justify-content-start d-print-none" variant="pills">
        <RoutedNavLink href="/docs/about/" current={path}>About OpenSanctions</RoutedNavLink>
        <RoutedNavLink href="/docs/terms/" current={path}>Terms and conditions</RoutedNavLink>
        <RoutedNavLink href="/docs/privacy/" current={path}>Privacy Policy</RoutedNavLink>
        <RoutedNavLink href="/impressum/" current={path}>Impressum</RoutedNavLink>
      </Nav>
      <LicenseInfo />
    </>
  );
}

export function DocumentationMenu({ path }: MenuProps) {
  return (
    <>
      <Nav className="flex-column justify-content-start d-print-none" variant="pills">
        <RoutedNavLink href="/docs/" current={path}>Overview</RoutedNavLink>
        <NavItem>
          <RoutedNavLink href="/docs/data/" current={path}>Understanding the data</RoutedNavLink>
          <NavItem>
            <RoutedNavLink href="/docs/entities/" current={path}>Entity structure</RoutedNavLink>
            <RoutedNavLink href="/reference/" current={path}>Data dictionary</RoutedNavLink>
            <RoutedNavLink href="/docs/identifiers/" current={path}>Identifiers and de-duplication</RoutedNavLink>
            <RoutedNavLink href="/docs/pep/methodology/" current={path}>Political positions</RoutedNavLink>
            <RoutedNavLink href="/docs/topics/" current={path}>Entity risk tagging</RoutedNavLink>
            <RoutedNavLink href="/docs/data/changes/" current={path}>Change policy</RoutedNavLink>
            <RoutedNavLink href="/docs/enrichment/" current={path}>Data enrichment</RoutedNavLink>
          </NavItem>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/docs/opensource/" current={path}>Open source</RoutedNavLink>
          <NavItem>
            <RoutedNavLink href="https://yente.followthemoney.tech" current={path}>yente <BoxArrowUpRight className="menu-icon" /></RoutedNavLink>
            <RoutedNavLink href="https://followthemoney.tech" current={path}>followthemoney <BoxArrowUpRight className="menu-icon" /></RoutedNavLink>
            <RoutedNavLink href="https://zavod.opensanctions.org" current={path}>zavod <BoxArrowUpRight className="menu-icon" /></RoutedNavLink>
            <RoutedNavLink href="/docs/opensource/contributing" current={path}>Contributing</RoutedNavLink>
            <RoutedNavLink href="/docs/opensource/pairs/" current={path}>Matcher training data</RoutedNavLink>
          </NavItem>
        </NavItem>
      </Nav >
      <LicenseInfo />
    </>
  );
}
