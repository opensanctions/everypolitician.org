import { Entity } from '../lib/ftm';
import Research from './Research';
import LayoutFrame from './layout/LayoutFrame';
import { Alert, AlertHeading, Button, ButtonGroup, Container } from './wrapped';

import styles from '../styles/Policy.module.scss';

export function LicenseInfo() {
  // 'use cache';
  return (
    <div className={styles.licenseBox}>
      <Alert variant="light">
        <p>
          OpenSanctions is <strong>free for non-commercial users.</strong> Businesses
          must acquire a data license to use the dataset.
        </p>
        <ButtonGroup className="d-print-none">
          <Button href="/api/" variant="secondary">Use the API</Button>
          <Button href="/licensing/" variant="light">License in bulk</Button>
        </ButtonGroup>
      </Alert>
    </div>
  );
}
