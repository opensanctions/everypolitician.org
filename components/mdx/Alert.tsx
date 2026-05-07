import { ReactNode } from 'react';

type AlertType = 'primary' | 'warning' | 'secondary';

const alertIcons: Record<AlertType, string> = {
  primary: '🔍',
  warning: '⚠️',
  secondary: '💡',
};

interface AlertProps {
  type?: AlertType;
  children: ReactNode;
}

export default function Alert({ type = 'primary', children }: AlertProps) {
  return (
    <div className={`alert alert-${type} d-flex gap-2 align-items-start`}>
      <span className="fs-5" aria-hidden="true">
        {alertIcons[type]}
      </span>
      <div>{children}</div>
    </div>
  );
}
