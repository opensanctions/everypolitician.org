import Link from 'next/link';

import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import CardText from 'react-bootstrap/CardText';
import CardTitle from 'react-bootstrap/CardTitle';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const POLILOOM_URL = 'https://loom.everypolitician.org/';
const GOVDIRECTORY_URL = 'https://www.govdirectory.org/';

type ContributeBoxProps = {
  /** Optional country name for contextual messaging */
  countryName?: string;
};

export function ContributeBox({ countryName }: ContributeBoxProps) {
  const contextualIntro = countryName
    ? `Help improve data for ${countryName}`
    : 'Help build the dataset';

  return (
    <div className="mt-4 mb-3">
      <h3>{contextualIntro}</h3>
      <p>
        EveryPolitician is a community effort. Contribute data and help us track
        who holds power around the world.
      </p>
      <Row>
        <Col md={6} className="mb-3 mb-md-0">
          <Card
            className="h-100 text-white border-0"
            style={{ backgroundColor: '#004eeb' }}
          >
            <CardBody>
              <CardTitle>Enrich Wikidata</CardTitle>
              <CardText>
                Use Poliloom to add and correct politician data on Wikidata.
                It&apos;s designed to make editing political data
                straightforward, even if you&apos;re new to Wikidata.
              </CardText>
              <Link href={POLILOOM_URL} className="btn btn-light">
                Get started with Poliloom
              </Link>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card
            className="h-100 text-white border-0"
            style={{ backgroundColor: '#e66a49' }}
          >
            <CardBody>
              <CardTitle>Add government sources</CardTitle>
              <CardText>
                GovDirectory collects links to official government websites.
                Help us find the sources we need to track political offices and
                office-holders.
              </CardText>
              <Link href={GOVDIRECTORY_URL} className="btn btn-light">
                Contribute to GovDirectory
              </Link>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
