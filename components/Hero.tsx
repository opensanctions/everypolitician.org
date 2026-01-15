import { ReactNode } from 'react';

import Container from 'react-bootstrap/Container';

interface HeroProps {
  title: string;
  size?: 'default' | 'large';
  background?: ReactNode;
  children?: ReactNode;
}

export function Hero({
  title,
  size = 'default',
  background,
  children,
}: HeroProps) {
  const sizeClass = size === 'large' ? 'hero-large' : '';

  return (
    <div className={`hero ${sizeClass}`.trim()}>
      {background}
      <div className="hero-overlay">
        <Container>
          <h1 className="hero-title">{title}</h1>
          {children}
        </Container>
      </div>
    </div>
  );
}
