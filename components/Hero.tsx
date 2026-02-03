import { ReactNode } from 'react';

import Container from 'react-bootstrap/Container';

interface HeroProps {
  title: string;
  size?: 'small' | 'medium' | 'large';
  background?: ReactNode;
  children?: ReactNode;
}

export function Hero({
  title,
  size = 'medium',
  background,
  children,
}: HeroProps) {
  return (
    <div
      className={`hero hero-${size} bg-accent position-relative overflow-hidden`}
    >
      <div className="hero-background">{background}</div>
      <div className="hero-overlay">
        <Container>
          <h1 className="hero-title">{title}</h1>
          {children}
        </Container>
      </div>
    </div>
  );
}
