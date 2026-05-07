import { ReactNode } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type SectionVariant = 'default' | 'accent' | 'dark';

type SectionProps = {
  children: ReactNode;
  variant?: SectionVariant;
  id?: string;
  className?: string;
  /** Additional classes for the inner Container */
  containerClassName?: string;
};

export default function Section({
  children,
  variant = 'default',
  id,
  className = '',
  containerClassName = '',
}: SectionProps) {
  const variantClasses: Record<SectionVariant, string> = {
    default: 'pt-4 pb-5',
    accent: 'bg-accent pt-4 pb-5',
    dark: 'bg-dark',
  };

  if (variant === 'dark') {
    return (
      <div id={id} className={`${variantClasses[variant]} ${className}`.trim()}>
        <Container>
          <Row className="py-4 text-white">
            <Col className="text-start text-md-center">{children}</Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div id={id} className={`${variantClasses[variant]} ${className}`.trim()}>
      <Container className={`my-5 ${containerClassName}`.trim()}>
        {children}
      </Container>
    </div>
  );
}
