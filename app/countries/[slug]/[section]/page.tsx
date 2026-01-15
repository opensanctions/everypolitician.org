import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import Table from 'react-bootstrap/Table';
import { Numeric } from '@/components/Formatting';
import { HelpLink } from '@/components/HelpLink';
import { getCountryPEPData, IPositionSummary } from '@/lib/peps';
import { getTerritoriesByCode } from '@/lib/territory';
import {
  positionSections,
  groupPositions,
  caseInsensitiveAlphabetic,
  reverseNumericAlphabetic,
  PositionSectionDefinition,
  PositionSubsectionDefinition,
} from '../positionDefinitions';

const slugCountryCode = (slug: string) => slug.split('.')[0];

const sectionByName = new Map<string, PositionSectionDefinition>(
  positionSections.map((s) => [s.name, s]),
);

export async function generateMetadata(props: {
  params: Promise<{ slug: string; section: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const countryCode = slugCountryCode(params.slug);
  const section = sectionByName.get(params.section);
  if (!section) {
    return {};
  }
  const territories = await getTerritoriesByCode();
  const info = territories.get(countryCode);
  const countryName = info?.label_short ?? countryCode.toUpperCase();
  return {
    title: `${section.label} in ${countryName}`,
    alternates: { canonical: `/countries/${countryCode}/${params.section}/` },
  };
}

function bestLabel(labels: string[]) {
  const isTitlecase = /^[A-Z]\w*/;
  for (const label of labels) {
    if (isTitlecase.exec(label) !== null) return label;
  }
  return labels[0];
}

type PositionSubsectionProps = {
  subsectionDefinition: PositionSubsectionDefinition;
  positions: IPositionSummary[];
};

function PositionSubsection({
  subsectionDefinition,
  positions,
}: PositionSubsectionProps) {
  if (positions == null || positions.length === 0) {
    return null;
  }

  return (
    <tbody>
      <tr>
        <th>{subsectionDefinition.label}</th>
        <th className="numeric text-end d-none d-md-table-cell">Current</th>
        <th className="numeric text-end d-none d-md-table-cell">Ended</th>
        <th className="numeric text-end d-none d-md-table-cell text-nowrap">
          Status unclear
          <HelpLink href="#explain-status-unclear" tooltipId="status-unclear">
            When we can not determine whether a person currently holds a
            position from our data source(s) with sufficient confidence, we
            indicate its status as unclear.
          </HelpLink>
        </th>
      </tr>
      {positions.map((position: IPositionSummary) => (
        <tr key={position.id}>
          <td>
            <Link prefetch={false} href={`/positions/${position.id}/`}>
              {bestLabel(position.names)}
            </Link>
          </td>
          <td className="numeric text-end d-none d-md-table-cell">
            <Numeric value={position.counts.current} />
          </td>
          <td className="numeric text-end d-none d-md-table-cell">
            <Numeric value={position.counts.ended} />
          </td>
          <td className="numeric text-end d-none d-md-table-cell">
            <Numeric value={position.counts.unknown} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

type PageProps = {
  params: Promise<{ slug: string; section: string }>;
};

export default async function SectionPage({ params }: PageProps) {
  const { slug, section: sectionName } = await params;
  const countryCode = slugCountryCode(slug);

  const section = sectionByName.get(sectionName);
  if (!section) {
    notFound();
  }

  const countryPEPSummary = await getCountryPEPData(countryCode);
  const positions: IPositionSummary[] = countryPEPSummary.positions ?? [];

  positions.sort(caseInsensitiveAlphabetic);
  const categoryResults = groupPositions(positions);
  categoryResults['other']?.sort(reverseNumericAlphabetic);

  const hasPositions = section.subsections.some((subsection) => {
    const subsectionPositions = categoryResults[subsection.name];
    return subsectionPositions && subsectionPositions.length > 0;
  });

  return (
    <>
      {!hasPositions ? (
        <p>No {section.label.toLowerCase()} available for this territory.</p>
      ) : (
        <Table>
          {section.subsections.map((subsectionDefinition) => {
            const subsectionPositions =
              categoryResults[subsectionDefinition.name];
            if (!subsectionPositions || subsectionPositions.length === 0) {
              return null;
            }
            return (
              <PositionSubsection
                key={subsectionDefinition.name}
                subsectionDefinition={subsectionDefinition}
                positions={subsectionPositions}
              />
            );
          })}
        </Table>
      )}

      <h4 id="explainer">What do these numbers mean?</h4>
      <p>
        We keep track both if political positions and the individuals who occupy
        those positions over time. Of course, a person can hold a position for
        multiple terms, and multiple people can occupy the same position at the
        same time (e.g. members of parliament).
      </p>
      <p>
        If a person previously held a position, and currently holds the same
        position, they are only counted once and recorded under Current. If it
        is unclear from the source whether they have left the position, they
        will be counted under Unclear.
      </p>
      <h4 id="explain-status-unclear">How can status be unclear?</h4>
      <p>
        Some of the data sources we rely on indicate both past and present
        holders of political offices. In those cases, a lack of a precise end
        date for a person&apos;s occupancy of a position can mean that we
        don&apos;t know whether they currently hold the position or not.{' '}
        <Link href="/docs/pep/methodology/#types">Read more...</Link>
      </p>
    </>
  );
}
