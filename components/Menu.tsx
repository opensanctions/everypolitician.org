
import { BoxArrowUpRight } from "react-bootstrap-icons";

import { LicenseInfo } from './Policy';
import { RoutedNavLink } from './util';
import { Nav, NavItem } from "./wrapped";


export type MenuProps = {
  path: string
}

export function DocsMenu({ path }: MenuProps) {
  return (
    <>
      <Nav className="flex-column justify-content-start d-print-none" variant="pills">
        <RoutedNavLink href="/docs/" current={path}>Overview</RoutedNavLink>
        <RoutedNavLink href="/docs/contribute/" current={path}>Contribute</RoutedNavLink>
        <RoutedNavLink href="/docs/methodology/" current={path}>Methodology</RoutedNavLink>
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
