import { ReactNode } from 'react';

interface HeroProps {
  children: ReactNode;
  className?: string;
}

export function Hero({ children, className = '' }: HeroProps) {
  return <div className={`hero ${className}`.trim()}>{children}</div>;
}
