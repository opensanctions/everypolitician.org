import Image from 'next/image';
import Link from 'next/link';
import {
  ChatRightHeartFill,
  EnvelopeOpenHeartFill,
  Github,
  HeartFill,
  LifePreserver,
  Linkedin,
  RocketTakeoffFill,
} from 'react-bootstrap-icons';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { LICENSE_URL, OSA_URL } from '@/lib/constants';

export default function Footer() {
  return (
    <div className="bg-dark text-light d-print-none" role="contentinfo">
      <Container className="py-5 mb-5">
        <Row>
          <Col md={3}>
            <strong className="text-white">What we do</strong>
            <ul className="list-unstyled">
              <li className="mt-1">
                <Link
                  href="/about/"
                  className="link-light text-decoration-underline"
                >
                  About EveryPolitician
                </Link>
              </li>
              <li className="mt-1">
                <Link
                  href={`${OSA_URL}/licensing/`}
                  className="link-light text-decoration-underline"
                >
                  Commercial use
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <strong className="text-white">Keep updated</strong>
            <ul className="list-unstyled">
              <li className="mt-1">
                <Link
                  href={`${OSA_URL}/newsletter/`}
                  aria-label="Subscribe to our newsletter"
                  className="link-light text-decoration-underline"
                >
                  <EnvelopeOpenHeartFill aria-hidden="true" /> Newsletter
                </Link>
              </li>
              <li className="mt-1">
                <Link
                  href="https://www.linkedin.com/company/opensanctions/"
                  className="link-light text-decoration-underline"
                >
                  <Linkedin aria-hidden="true" /> LinkedIn
                </Link>
              </li>
              <li className="mt-1">
                <Link
                  href="https://github.com/opensanctions/opensanctions"
                  className="link-light text-decoration-underline"
                >
                  <Github aria-hidden="true" /> Github code
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <strong className="text-white">Get in touch</strong>
            <ul className="list-unstyled">
              <li className="mt-1">
                <Link
                  href={`${OSA_URL}/support/`}
                  prefetch={false}
                  className="link-light text-decoration-underline"
                >
                  <LifePreserver aria-hidden="true" /> Get support
                </Link>
              </li>
              <li className="mt-1">
                <Link
                  href={`${OSA_URL}/sales/`}
                  className="link-light text-decoration-underline"
                >
                  <RocketTakeoffFill aria-hidden="true" /> Talk to sales
                </Link>
              </li>
              <li className="mt-1">
                <Link
                  href="https://discuss.opensanctions.org"
                  prefetch={false}
                  className="link-light text-decoration-underline"
                >
                  <ChatRightHeartFill aria-hidden="true" /> Forum
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <Link href={OSA_URL}>
              <Image
                src="https://assets.opensanctions.org/images/nura/logo-twolines-white.svg"
                alt="Part of OpenSanctions"
                width={200}
                height={60}
                style={{ width: '100%', height: 'auto' }}
              />
            </Link>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <p className="small mb-1">
              The data is licensed under the terms of{' '}
              <Link href={LICENSE_URL} rel="license" className="link-light">
                Creative Commons 4.0 Attribution NonCommercial
              </Link>
            </p>
            <p className="small mb-0">
              Made with <HeartFill className="text-danger" /> across Europe
              {' · '}
              <Link
                href="https://status.opensanctions.org"
                className="link-light"
              >
                System status
              </Link>
              {' · '}
              <Link href={`${OSA_URL}/changelog/`} className="link-light">
                Changelog
              </Link>
              {' · '}
              <Link
                href={`${OSA_URL}/docs/privacy/`}
                prefetch={false}
                className="link-light"
              >
                Privacy
              </Link>
              {' · '}
              <Link
                href={`${OSA_URL}/docs/security/`}
                prefetch={false}
                className="link-light"
              >
                Security
              </Link>
              {' · '}
              <Link
                href={`${OSA_URL}/impressum/`}
                prefetch={false}
                className="link-light"
              >
                Impressum
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
