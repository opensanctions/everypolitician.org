'use client';

import { ReactNode } from 'react';
import { QuestionCircleFill } from 'react-bootstrap-icons';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

type HelpLinkProps = {
  href?: string;
  children: ReactNode;
  tooltip: ReactNode;
  tooltipId: string;
};

export function HelpLink({
  href,
  children,
  tooltip,
  tooltipId,
}: HelpLinkProps) {
  const inner = (
    <>
      {children}
      <sup>
        <QuestionCircleFill size={10} />
      </sup>
    </>
  );

  const content = href ? (
    <a
      href={href}
      className="d-print-none text-decoration-none"
      style={{ color: 'inherit' }}
    >
      {inner}
    </a>
  ) : (
    <span className="d-print-none" role="button" style={{ cursor: 'help' }}>
      {inner}
    </span>
  );

  return (
    <OverlayTrigger overlay={<Tooltip id={tooltipId}>{tooltip}</Tooltip>}>
      {content}
    </OverlayTrigger>
  );
}
