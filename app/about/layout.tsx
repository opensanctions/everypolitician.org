import { ReactNode } from 'react';

import LayoutFrame from '@/components/layout/LayoutFrame';
import AboutSidebar from '@/components/docs/AboutSidebar';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

interface AboutLayoutProps {
  children: ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <LayoutFrame>
      <Container className="py-4 mb-5">
        <Row>
          <Col md={9} className="order-1 order-md-2">
            <Row className="justify-content-center">
              <Col lg={10}>{children}</Col>
            </Row>
          </Col>
          <Col md={3} className="order-2 order-md-1 py-2">
            <AboutSidebar />
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  );
}
