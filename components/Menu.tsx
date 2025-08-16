
import { RoutedNavLink } from './util';
import { Nav, NavItem } from "./wrapped";

import { BoxArrowUpRight } from "react-bootstrap-icons";
import { LicenseInfo } from './Policy';

export type MenuProps = {
  path: string
}


export function AboutMenu({ path }: MenuProps) {
  return (
    <>
      <Nav className="flex-column justify-content-start d-print-none" variant="pills">
        <NavItem>
          <RoutedNavLink href="/docs/about/" current={path}>About OpenSanctions</RoutedNavLink>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/faq/?nav=about&section=Basics&section=Commercial&section=Policy" current={path}>FAQ</RoutedNavLink>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/licensing/" current={path}>Licensing the data</RoutedNavLink>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/contact/" current={path}>Contact us</RoutedNavLink>
          <NavItem>
            <RoutedNavLink href="/sales/" current={path}>Talk to sales</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/support/" current={path}>Get support</RoutedNavLink>
          </NavItem>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/docs/company/team/" current={path}>The team</RoutedNavLink>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/docs/company/jobs/" current={path}>Work with us</RoutedNavLink>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/docs/criteria/" current={path}>Data inclusion criteria</RoutedNavLink>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/docs/bibliography/" current={path}>Research bibliography</RoutedNavLink>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/docs/terms/" current={path}>Terms and conditions</RoutedNavLink>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/docs/privacy/" current={path}>Privacy Policy</RoutedNavLink>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/impressum/" current={path}>Impressum</RoutedNavLink>
        </NavItem>
      </Nav>
      <LicenseInfo />
    </>
  );
}

export function DocumentationMenu({ path }: MenuProps) {
  return (
    <>
      <Nav className="flex-column justify-content-start d-print-none" variant="pills">
        <NavItem>
          <RoutedNavLink href="/faq/?section=Concepts&section=Data structure&section=Bulk data&section=API&section=yente" current={path}>FAQ</RoutedNavLink>
          <RoutedNavLink href="/docs/data/" current={path}>Understanding the data</RoutedNavLink>
          <NavItem>
            <RoutedNavLink href="/docs/entities/" current={path}>Entity structure</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/reference/" current={path}>Data dictionary</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/identifiers/" current={path}>Identifiers and de-duplication</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/pep/methodology/" current={path}>Political positions</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/topics/" current={path}>Entity risk tagging</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/data/changes/" current={path}>Change policy</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/enrichment/" current={path}>Data enrichment</RoutedNavLink>
          </NavItem>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/docs/bulk/" current={path}>Using the bulk data</RoutedNavLink>
          <NavItem>
            <RoutedNavLink href="/docs/bulk/formats/" current={path}>Data formats</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/bulk/updates/" current={path}>Downloading the data</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/bulk/delta/" current={path}>Using delta files</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/statements/" current={path}>Statement-based data</RoutedNavLink>
          </NavItem>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/api/" current={path}>OpenSanctions API</RoutedNavLink>
          <NavItem>
            <RoutedNavLink href="/docs/api/" current={path}>Getting started</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/api/authentication/" current={path}>Authentication</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/api/matching/" current={path}>Using the matching API</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/api/scoring/" current={path}>Configure result scoring</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/api/search/" current={path}>Using the search API</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/on-premise/" current={path}>On-premise API</RoutedNavLink>
          </NavItem>
        </NavItem>
        <NavItem>
          <RoutedNavLink href="/docs/opensource/" current={path}>Open source</RoutedNavLink>
          <NavItem>
            <RoutedNavLink href="/docs/yente/" current={path}>yente</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="https://followthemoney.tech" current={path}>followthemoney <BoxArrowUpRight className="menu-icon" /></RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="https://zavod.opensanctions.org" current={path}>zavod <BoxArrowUpRight className="menu-icon" /></RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/opensource/contributing" current={path}>Contributing</RoutedNavLink>
          </NavItem>
          <NavItem>
            <RoutedNavLink href="/docs/opensource/pairs/" current={path}>Matcher training data</RoutedNavLink>
          </NavItem>
        </NavItem>
      </Nav >
      <LicenseInfo />
    </>
  );
}
