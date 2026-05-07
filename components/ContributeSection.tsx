import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Section from '@/components/layout/Section';
import { BoxArrowUpRight } from 'react-bootstrap-icons';

type ContributeCard = {
  title: string;
  description: string;
  href: string;
  label: string;
};

type ContributeSectionProps = {
  heading: string;
  description: React.ReactNode;
  cards: ContributeCard[];
};

export default function ContributeSection({
  heading,
  description,
  cards,
}: ContributeSectionProps) {
  return (
    <Section variant="accent">
      <Row>
        <Col md={8}>
          <h3>{heading}</h3>
          <p className="mb-5">{description}</p>
        </Col>
      </Row>
      <Row>
        {cards.map((card, index) => (
          <Col
            key={card.title}
            md={4}
            className={index < cards.length - 1 ? 'mb-3 mb-md-0' : ''}
          >
            <Card className="h-100 border-0">
              <CardBody className="d-flex flex-column">
                <h5>{card.title}</h5>
                <p className="flex-grow-1">{card.description}</p>
                <Button
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  className="w-100"
                >
                  {card.label} <BoxArrowUpRight />
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Section>
  );
}
