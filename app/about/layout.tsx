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
          <Col lg={3} className="d-none d-lg-block py-2">
            <AboutSidebar />
          </Col>
          <Col lg={9}>
            <Row className="justify-content-center">
              <Col xl={10}>{children}</Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </LayoutFrame>
  );
}
