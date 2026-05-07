import { ReactNode } from 'react';

import LayoutFrame from '@/components/layout/LayoutFrame';
import AboutSidebar from '@/components/docs/AboutSidebar';
import Col from 'react-bootstrap/Col';
import Section from '@/components/layout/Section';
import Row from 'react-bootstrap/Row';

interface AboutLayoutProps {
  children: ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <LayoutFrame>
      <Section>
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
      </Section>
    </LayoutFrame>
  );
}
