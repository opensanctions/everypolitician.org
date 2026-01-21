import Link from 'next/link';
import type { ReactNode } from 'react';

import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import CardText from 'react-bootstrap/CardText';
import CardTitle from 'react-bootstrap/CardTitle';

type ContributeBoxVariant = 'primary' | 'secondary';

type ContributeBoxProps = {
  variant: ContributeBoxVariant;
  title: string;
  linkUrl: string;
  linkText: string;
  children: ReactNode;
};

const VARIANT_COLORS: Record<ContributeBoxVariant, string> = {
  primary: '#004eeb',
  secondary: '#e66a49',
};

export function ContributeBox({
  variant,
  title,
  linkUrl,
  linkText,
  children,
}: ContributeBoxProps) {
  return (
    <Card
      className="h-100 text-white border-0"
      style={{ backgroundColor: VARIANT_COLORS[variant] }}
    >
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardText>{children}</CardText>
        <Link href={linkUrl} className="btn btn-light">
          {linkText}
        </Link>
      </CardBody>
    </Card>
  );
}
