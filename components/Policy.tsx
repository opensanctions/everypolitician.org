import { OSA_URL } from '@/lib/constants';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';

export function LicenseInfo() {
  return (
    <Card className="license-box border-0 mt-5">
      <CardBody>
        <p>
          OpenSanctions&apos;s <strong>commercial-use PEP data product</strong>{' '}
          is available for screening and due diligence.
        </p>
        <ButtonGroup className="d-print-none">
          <Button href={`${OSA_URL}/api/`} className="btn-license-primary">
            Use the API
          </Button>
          <Button
            href={`${OSA_URL}/licensing/`}
            className="btn-license-secondary"
          >
            License in bulk
          </Button>
        </ButtonGroup>
      </CardBody>
    </Card>
  );
}
