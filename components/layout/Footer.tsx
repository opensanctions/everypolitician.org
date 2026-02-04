import Image from 'next/image';
import Link from 'next/link';
import { ChatRightHeartFill, Github, HeartFill } from 'react-bootstrap-icons';

import { LICENSE_URL, OSA_URL } from '@/lib/constants';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default function Footer() {
  return (
    <div className="bg-dark text-light d-print-none" role="contentinfo">
      <Container className="py-5 mb-5">
        <Row>
          <Col md={3} className="mb-3">
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
          <Col md={3} className="mb-3">
            <strong className="text-white">Get in touch</strong>
            <ul className="list-unstyled">
              <li className="mt-1">
                <Link
                  href="https://discuss.opensanctions.org/c/every-politician"
                  prefetch={false}
                  className="link-light text-decoration-underline"
                >
                  <ChatRightHeartFill aria-hidden="true" /> Forum
                </Link>
              </li>
              <li className="mt-1">
                <Link
                  href="https://github.com/opensanctions/everypolitician.org"
                  className="link-light text-decoration-underline"
                >
                  <Github aria-hidden="true" /> GitHub
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-3">
            <strong className="text-white">On Wikidata</strong>
            <ul className="list-unstyled">
              <li className="mt-1">
                <Link
                  href="https://www.wikidata.org/wiki/Wikidata:WikiProject_Govdirectory"
                  prefetch={false}
                  className="link-light text-decoration-underline"
                >
                  WikiProject Govdirectory
                </Link>
              </li>
              <li className="mt-1">
                <Link
                  href="https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician"
                  className="link-light text-decoration-underline"
                >
                  WikiProject every politician
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-3 py-3 py-md-0">
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
        <Row>
          <Col>
            <p className="small my-1">
              The data is licensed under the terms of{' '}
              <Link href={LICENSE_URL} rel="license" className="link-light">
                Creative Commons 4.0 Attribution NonCommercial
              </Link>
            </p>
            <p className="small mb-0">
              Made with <HeartFill className="text-danger" /> across Europe
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
