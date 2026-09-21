'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useSyncExternalStore } from 'react';

import { GA_TRACKING_ID, OSA_URL } from '../lib/constants';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

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

const CONSENT_KEY = 'analytics-consent';

const consentListeners = new Set<() => void>();

function subscribeConsent(onChange: () => void) {
  consentListeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    consentListeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function readConsent() {
  return localStorage.getItem(CONSENT_KEY) || 'ask';
}

function readConsentOnServer() {
  return 'loading';
}

function configureConsent(consent: string) {
  localStorage.setItem(CONSENT_KEY, consent);
  for (const onChange of consentListeners) onChange();
}

export default function AnalyticsManager() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    readConsent,
    readConsentOnServer,
  );

  if (consent === 'granted') {
    return <Analytics />;
  }

  if (consent !== 'ask') {
    return null;
  }

  return (
    <div className="position-fixed bottom-0 w-100 bg-secondary-subtle shadow-lg z-3 py-3">
      <Container className="d-print-none">
        <Row>
          <Col md="9" xs="7">
            <p className="d-none d-md-block">
              OpenSanctions would like to use analytics to better understand how
              people use the service.
              <br />
              For more information, read our{' '}
              <Link href={`${OSA_URL}/docs/privacy/`} prefetch={false}>
                privacy policy
              </Link>
              .
            </p>
            <p className="d-block d-md-none">
              We use analytics to better understand how people use our service.
              Read our{' '}
              <Link href={`${OSA_URL}/docs/privacy/`} prefetch={false}>
                privacy policy
              </Link>
              .
            </p>
          </Col>
          <Col md="3" xs="5" className="text-end">
            <ButtonGroup>
              <Button
                onClick={() => configureConsent('granted')}
                variant="success"
              >
                OK
              </Button>
              <Button
                onClick={() => configureConsent('denied')}
                variant="light"
              >
                Disable
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
