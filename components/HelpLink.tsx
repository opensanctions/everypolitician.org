'use client';

import { ReactNode } from 'react';
import { Placement } from 'react-bootstrap/esm/types';
import { QuestionCircleFill } from 'react-bootstrap-icons';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

type HelpLinkProps = {
  href: string;
  size?: number;
  children?: ReactNode;
  tooltipId?: string;
  placement?: Placement;
  variant?: 'muted' | 'white';
};

export function HelpLink({
  href,
  size = 10,
  children,
  tooltipId,
  placement = 'top',
  variant = 'muted',
}: HelpLinkProps) {
  const colorClass = variant === 'white' ? 'text-white' : 'text-muted';
  const link = (
    <a href={href} className={`d-print-none ${colorClass}`}>
      <sup>
        <QuestionCircleFill size={size} />
      </sup>
    </a>
  );
  return !!tooltipId ? (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip id={tooltipId}>{children}</Tooltip>}
    >
      <span>{link}</span>
    </OverlayTrigger>
  ) : (
    link
  );
}
