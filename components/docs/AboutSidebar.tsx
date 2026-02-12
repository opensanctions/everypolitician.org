'use client';

import { usePathname } from 'next/navigation';
import Nav from 'react-bootstrap/Nav';
import NavLink from 'react-bootstrap/NavLink';

import { LicenseInfo } from '@/components/Policy';

export interface AboutMenuItem {
  path: string;
  title: string;
  children?: AboutMenuItem[];
}

export const aboutMenu: AboutMenuItem[] = [
  { path: '/about/', title: 'About' },
  { path: '/about/methodology/', title: 'Methodology' },
  {
    path: '/about/contribute/',
    title: 'Contribute',
    children: [
      { path: '/about/contribute/poliloom/', title: 'Using PoliLoom' },
      { path: '/about/contribute/wikidata/', title: 'Editing Wikidata' },
    ],
  },
];

function MenuItemLink({
  item,
  activePath,
  depth = 0,
}: {
  item: AboutMenuItem;
  activePath: string;
  depth?: number;
}) {
  const isActive = activePath === item.path;

  return (
    <>
      <NavLink
        href={item.path}
        active={isActive}
        className={depth > 0 ? 'ps-4' : ''}
      >
        {item.title}
      </NavLink>
      {item.children?.map((child) => (
        <MenuItemLink
          key={child.path}
          item={child}
          activePath={activePath}
          depth={depth + 1}
        />
      ))}
    </>
  );
}

export default function AboutSidebar() {
  const pathname = usePathname();

  return (
    <>
      <Nav
        className="flex-column justify-content-start d-print-none"
        variant="pills"
      >
        {aboutMenu.map((item) => (
          <MenuItemLink key={item.path} item={item} activePath={pathname} />
        ))}
      </Nav>
      <LicenseInfo />
    </>
  );
}
