'use client';

import Nav from 'react-bootstrap/Nav';
import NavLink from 'react-bootstrap/NavLink';

import { MenuItem } from '@/lib/pages';

interface DocsSidebarProps {
  menu: MenuItem[];
  activePath: string;
}

function MenuItemLink({
  item,
  activePath,
  depth = 0,
}: {
  item: MenuItem;
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
      {item.children.map((child) => (
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

export default function DocsSidebar({ menu, activePath }: DocsSidebarProps) {
  return (
    <Nav
      className="flex-column justify-content-start d-print-none"
      variant="pills"
    >
      {menu.map((item) => (
        <MenuItemLink key={item.path} item={item} activePath={activePath} />
      ))}
    </Nav>
  );
}
