import { BoxArrowUpRight } from 'react-bootstrap-icons';

import { LicenseInfo } from './Policy';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';

export type MenuItem = {
  href: string;
  label: string;
  external?: boolean;
  children?: MenuItem[];
};

type MenuItemComponentProps = {
  item: MenuItem;
  current?: string;
  nested?: boolean;
};

function MenuItemComponent({ item, current, nested }: MenuItemComponentProps) {
  const matchingPath = item.href.split('?')[0];
  const isActive = current === matchingPath;

  const linkContent = (
    <>
      {item.label}
      {item.external && (
        <>
          {' '}
          <BoxArrowUpRight className="menu-icon" />
        </>
      )}
    </>
  );

  if (item.children && item.children.length > 0) {
    return (
      <NavItem>
        <NavLink href={item.href} active={isActive}>
          {linkContent}
        </NavLink>
        <NavItem className="ms-3">
          {item.children.map((child) => (
            <MenuItemComponent
              key={child.href}
              item={child}
              current={current}
              nested
            />
          ))}
        </NavItem>
      </NavItem>
    );
  }

  return (
    <NavLink
      href={item.href}
      active={isActive}
      className={nested ? 'small' : undefined}
    >
      {linkContent}
    </NavLink>
  );
}

export type MenuProps = {
  items: MenuItem[];
  current?: string;
  showLicense?: boolean;
};

export function Menu({ items, current, showLicense = false }: MenuProps) {
  return (
    <>
      <Nav
        className="flex-column justify-content-start d-print-none"
        variant="pills"
      >
        {items.map((item) => (
          <MenuItemComponent key={item.href} item={item} current={current} />
        ))}
      </Nav>
      {showLicense && <LicenseInfo />}
    </>
  );
}
