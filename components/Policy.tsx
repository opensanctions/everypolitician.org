import { OSA_URL } from '@/lib/constants';
import { Entity } from '../lib/ftm';


import LayoutFrame from './layout/LayoutFrame';
import Research from './Research';
import { Alert, AlertHeading, Button, ButtonGroup, Container } from './wrapped';

import styles from '@/styles/Policy.module.scss';


export function LicenseInfo() {
  // 'use cache';
  return (
    <div className={styles.licenseBox}>
      <Alert variant="light">
        <p>
          EveryPolitician is <strong>free for non-commercial users.</strong> Businesses
          must acquire a data license to use the dataset.
        </p>
        <ButtonGroup className="d-print-none">
          <Button href={`${OSA_URL}/api/`} variant="secondary">Use the API</Button>
          <Button href={`${OSA_URL}/licensing/`} variant="tertiary">License in bulk</Button>
        </ButtonGroup>
      </Alert>
    </div>
  );
}

interface BlockedEntityProps {
  entity: Entity
}

export function BlockedEntity({ entity }: BlockedEntityProps) {
  return (
    <LayoutFrame activeSection="research">
      <Research.Context>
        <Container>
          <br />
          <Alert variant="warning">
            <AlertHeading>Blocked entity</AlertHeading>
            <p>
              The entity with ID <code>{entity.id}</code> has been removed from the
              OpenSanctions website due to unusual legal circumstances.
            </p>
          </Alert>
        </Container>
      </Research.Context>
    </LayoutFrame>
  );
}
