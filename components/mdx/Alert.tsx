import { ReactNode } from 'react';

type AlertType = 'info' | 'warning' | 'secondary';

interface AlertProps {
  type?: AlertType;
  children: ReactNode;
}

export default function Alert({ type = 'info', children }: AlertProps) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}
