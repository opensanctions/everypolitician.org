import { ReactNode } from 'react';

type AlertType = 'primary' | 'info' | 'warning' | 'secondary';

interface AlertProps {
  type?: AlertType;
  children: ReactNode;
}

export default function Alert({ type = 'primary', children }: AlertProps) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}
