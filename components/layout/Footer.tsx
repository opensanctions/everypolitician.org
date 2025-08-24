import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { ChatRightHeartFill, EnvelopeOpenHeartFill, Github, HeartFill, LifePreserver, Linkedin, RocketTakeoffFill } from 'react-bootstrap-icons';

import { CLAIM, LICENSE_URL, SPACER } from '@/lib/constants';
import styles from '@/styles/Footer.module.scss';
import { Spacer } from '../util';
import { Col, Container, Row } from '../wrapped';

export default function Footer() {
  return (
    <>
      <div className={classNames("d-print-none", styles.footer)} role="contentinfo">
        <Container>
          <Row>
            {/* <Col md={3}>
              <img
                src="https://assets.opensanctions.org/images/ura/logo_footer.svg"
                alt="OpenSanctions"
                className={styles.logo}
                width="100%"
              />
            </Col> */}
            <Col md={10}>
              <Row>
                <Col md={3}>
                  <strong>What we do</strong>
                  <ul>
                    <li>
                      <Link href="/docs/about/">About OpenSanctions</Link>
                    </li>
                    <li>
                      <Link href="/docs/">Documentation</Link>
                    </li>
                    <li>
                      <Link href="/licensing/">Commercial use</Link>
                    </li>
                  </ul>
                </Col>
                <Col md={3}>
                  <strong>Collections</strong>
                  <ul>
                    <li>
                      <Link href="/datasets/sanctions/">Global sanctions</Link>
                    </li>
                    <li>
                      <Link href="/pep/">Politically exposed persons</Link>
                    </li>
                    <li>
                      <Link href="/datasets/crime/">Criminal watchlists</Link>
                    </li>
                  </ul>
                </Col>
                <Col md={3}>
                  <strong>Keep updated</strong>
                  <ul>
                    <li>
                      <Link href="/newsletter/" aria-hidden="true"><EnvelopeOpenHeartFill /></Link>
                      {' '}
                      <Link href="/newsletter/" aria-label='Subscribe to our newsletter'>Newsletter</Link>
                    </li>
                    <li>
                      <Link href="https://www.linkedin.com/company/opensanctions/" aria-hidden="true"><Linkedin /></Link>
                      {' '}
                      <Link href="https://www.linkedin.com/company/opensanctions/">LinkedIn</Link>
                    </li>
                    <li>
                      <Link href="https://github.com/opensanctions/opensanctions" aria-hidden="true"><Github /></Link>
                      {' '}
                      <Link href="https://github.com/opensanctions/opensanctions">Github code</Link>
                    </li>
                  </ul>
                </Col>
                <Col md={3}>
                  <strong>Get in touch</strong>
                  <ul>
                    <li>
                      <Link href="/support/" prefetch={false} aria-hidden="true"><LifePreserver /></Link>
                      {' '}
                      <Link href="/support/" prefetch={false}>Get support</Link>
                    </li>
                    <li>
                      <Link href="/sales/" aria-hidden="true"><RocketTakeoffFill /></Link>
                      {' '}
                      <Link href="/sales/">Talk to sales</Link>
                    </li>
                    <li>
                      <Link href="https://discuss.opensanctions.org" prefetch={false} aria-hidden="true"><ChatRightHeartFill /></Link>
                      {' '}
                      <Link href="https://discuss.opensanctions.org" prefetch={false}>Forum</Link>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row>
                <p className={styles.copyright}>
                  The data is licensed under
                  the terms of <Link href={LICENSE_URL} rel="license">Creative Commons 4.0 Attribution NonCommercial</Link>
                </p>
                <p className={styles.copyright}>
                  Made with <HeartFill className={styles.love} /> across Europe
                  {SPACER}
                  <Link href="/account/" prefetch={false}>API console</Link>
                  {SPACER}
                  <Link href="https://status.opensanctions.org">System status</Link>
                  {SPACER}
                  <Link href="/changelog/">Changelog</Link>
                  {SPACER}
                  <Link href="/impressum/" prefetch={false}>Impressum</Link>
                  {SPACER}
                  <Link href="https://trust.opensanctions.org">Trust Center</Link>
                  {SPACER}
                  <Link href="/docs/privacy/" prefetch={false}>Privacy</Link>
                  {SPACER}
                  <Link href="/docs/security/" prefetch={false}>Security</Link>
                </p>
              </Row>
            </Col>
            <Col md={2}>
              <Link href="http://trust.opensanctions.org/">
                <img
                  src="https://assets.opensanctions.org/images/iso27001-alt.png"
                  alt="We are ISO27001 certified!"
                  className={styles.logo}
                  width="100%"
                />
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
      <div className={classNames(styles.printFooter, "d-none", "d-print-block")}>
        <Container>
          <div className={styles.footerImprint}>
            <strong>OpenSanctions</strong> <Spacer /> {CLAIM}<br />
            OpenSanctions Datenbanken GmbH <Spacer /> info@opensanctions.org <Spacer /> <Link href="https://opensanctions.org/meeting">https://opensanctions.org/meeting</Link>
          </div>
        </Container>
      </div >
    </>
  )
}
