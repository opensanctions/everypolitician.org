'use client';

import { OSA_URL } from '@/lib/constants';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export function LicenseInfo() {
  // 'use cache';
  return (
    <div>
      <Alert variant="primary">
        <p className="text-white">
          EveryPolitician is <strong>free for non-commercial users.</strong>{' '}
          Businesses must acquire a data license to use the dataset.
        </p>
        <ButtonGroup className="d-print-none">
          <Button href={`${OSA_URL}/api/`} variant="light">
            Use the API
          </Button>
          <Button href={`${OSA_URL}/licensing/`} variant="outline-light">
            License in bulk
          </Button>
        </ButtonGroup>
      </Alert>
    </div>
  );
}
