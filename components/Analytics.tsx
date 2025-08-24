'use client';

import Link from 'next/link';
import Script from 'next/script'
import { useEffect, useState } from 'react';

import { GA_TRACKING_ID } from '@/lib/constants';
import { Row, Col, Container, ButtonGroup, Button } from "./wrapped";

import styles from '@/styles/Analytics.module.scss';


function Analytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                  ad_storage: "denied",
                  analytics_storage: "granted",
                  functionality_storage: "granted",
                  personalization_storage : "denied",
                  security_storage : "granted",
                });
              `,
        }}
      />
    </>
  );
}


export default function AnalyticsManager() {
  const [consent, setConsent] = useState("loading");

  useEffect(() => {
    const storedConsent = localStorage.getItem("analytics-consent") || "ask";
    setConsent(storedConsent);
  }, []);

  const configureConsent = (consent: string) => {
    localStorage.setItem("analytics-consent", consent);
    setConsent(consent);
  };

  if (consent === "granted") {
    return <Analytics />;
  }

  if (consent !== "ask") {
    return null;
  }

  return (
    <div className={styles.consentBox}>
      <Container className="d-print-none">
        <Row>
          <Col md="9" xs="7">
            <p className="d-none d-md-block">
              OpenSanctions would like to use analytics to better understand how
              people use the service.
              <br />
              For more information, read our <Link href="/docs/privacy/">privacy policy</Link>.
            </p>
            <p className="d-block d-md-none">
              We use analytics to better understand how people use our service.
              Read our <Link href="/docs/privacy/">privacy policy</Link>.
            </p>
          </Col>
          <Col md="3" xs="5" className={styles.consentButtons}>
            <ButtonGroup>
              <Button onClick={() => configureConsent("granted")} variant="secondary">OK</Button>
              <Button onClick={() => configureConsent("denied")} variant="light">Disable</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
