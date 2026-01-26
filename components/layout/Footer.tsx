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
import { LICENSE_URL, OSA_URL, SPACER } from '@/lib/constants';

export default function Footer() {
  return (
    <>
      <div className="footer d-print-none" role="contentinfo">
        <Container>
          <Row>
            <Col md={10}>
              <Row>
                <Col md={3}>
                  <strong className="text-white">What we do</strong>
                  <ul className="list-unstyled">
                    <li>
                      <Link href="/docs/about/" className="text-light">
                        About OpenSanctions
                      </Link>
                    </li>
                    <li>
                      <Link href="/docs/" className="text-light">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`${OSA_URL}/licensing/`}
                        className="text-light"
                      >
                        Commercial use
                      </Link>
                    </li>
                  </ul>
                </Col>
                <Col md={3}>
                  <strong className="text-white">Keep updated</strong>
                  <ul className="list-unstyled">
                    <li>
                      <Link
                        href={`${OSA_URL}/newsletter/`}
                        aria-hidden="true"
                        className="text-light"
                      >
                        <EnvelopeOpenHeartFill />
                      </Link>{' '}
                      <Link
                        href={`${OSA_URL}/newsletter/`}
                        aria-label="Subscribe to our newsletter"
                        className="text-light"
                      >
                        Newsletter
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.linkedin.com/company/opensanctions/"
                        aria-hidden="true"
                        className="text-light"
                      >
                        <Linkedin />
                      </Link>{' '}
                      <Link
                        href="https://www.linkedin.com/company/opensanctions/"
                        className="text-light"
                      >
                        LinkedIn
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://github.com/opensanctions/opensanctions"
                        aria-hidden="true"
                        className="text-light"
                      >
                        <Github />
                      </Link>{' '}
                      <Link
                        href="https://github.com/opensanctions/opensanctions"
                        className="text-light"
                      >
                        Github code
                      </Link>
                    </li>
                  </ul>
                </Col>
                <Col md={3}>
                  <strong className="text-white">Get in touch</strong>
                  <ul className="list-unstyled">
                    <li>
                      <Link
                        href={`${OSA_URL}/support/`}
                        prefetch={false}
                        aria-hidden="true"
                        className="text-light"
                      >
                        <LifePreserver />
                      </Link>{' '}
                      <Link
                        href={`${OSA_URL}/support/`}
                        prefetch={false}
                        className="text-light"
                      >
                        Get support
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`${OSA_URL}/sales/`}
                        aria-hidden="true"
                        className="text-light"
                      >
                        <RocketTakeoffFill />
                      </Link>{' '}
                      <Link href={`${OSA_URL}/sales/`} className="text-light">
                        Talk to sales
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://discuss.opensanctions.org"
                        prefetch={false}
                        aria-hidden="true"
                        className="text-light"
                      >
                        <ChatRightHeartFill />
                      </Link>{' '}
                      <Link
                        href="https://discuss.opensanctions.org"
                        prefetch={false}
                        className="text-light"
                      >
                        Forum
                      </Link>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row>
                <p className="small">
                  The data is licensed under the terms of{' '}
                  <Link href={LICENSE_URL} rel="license" className="text-light">
                    Creative Commons 4.0 Attribution NonCommercial
                  </Link>
                </p>
                <p className="small">
                  Made with <HeartFill className="text-danger" /> across Europe
                  {SPACER}
                  <Link
                    href="https://status.opensanctions.org"
                    className="text-light"
                  >
                    System status
                  </Link>
                  {SPACER}
                  <Link href={`${OSA_URL}/changelog/`} className="text-light">
                    Changelog
                  </Link>
                  {SPACER}
                  <Link
                    href={`${OSA_URL}/docs/privacy/`}
                    prefetch={false}
                    className="text-light"
                  >
                    Privacy
                  </Link>
                  {SPACER}
                  <Link
                    href={`${OSA_URL}/docs/security/`}
                    prefetch={false}
                    className="text-light"
                  >
                    Security
                  </Link>
                  {SPACER}
                  <Link
                    href={`${OSA_URL}/impressum/`}
                    prefetch={false}
                    className="text-light"
                  >
                    Impressum
                  </Link>
                </p>
              </Row>
            </Col>
            <Col md={2}>
              <Link href={OSA_URL}>
                <img
                  src="https://assets.opensanctions.org/images/nura/logo-twolines-white.svg"
                  alt="Part of OpenSanctions"
                  width="100%"
                />
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
