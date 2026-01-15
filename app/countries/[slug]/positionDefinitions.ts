import { IPositionSummary } from '@/lib/peps';

export type PositionSubsectionDefinition = {
  name: string;
  label: string;
};

export type PositionSectionDefinition = {
  name: string;
  label: string;
  navLabel: string;
  subsections: PositionSubsectionDefinition[];
};

export const positionSections: PositionSectionDefinition[] = [
  {
    name: 'national',
    label: 'National government positions',
    navLabel: 'National government',
    subsections: [
      { name: 'nat-head', label: 'Head of state or government' },
      { name: 'nat-exec', label: 'National executive branches' },
      { name: 'nat-legis', label: 'National legislative branch' },
      { name: 'nat-judicial', label: 'National judicial branch' },
      { name: 'nat-sec', label: 'National security' },
      { name: 'nat-fin', label: 'Central banking and financial integrity' },
      { name: 'diplo', label: 'Diplomatic roles' },
      { name: 'soe', label: 'State-owned enterprises' },
    ],
  },
  {
    name: 'intergovernmental',
    label: 'Intergovernmental positions',
    navLabel: 'Intergovernmental',
    subsections: [{ name: 'int', label: 'International bodies' }],
  },
  {
    name: 'subnational',
    label: 'Subnational government positions',
    navLabel: 'Subnational government',
    subsections: [
      { name: 'subnat-head', label: 'Subnational head of state or government' },
      { name: 'subnat-exec', label: 'Subnational executive branches' },
      { name: 'subnat-legis', label: 'Subnational legislative branch' },
      { name: 'subnat-judicial', label: 'Subnational judicial branch' },
    ],
  },
  {
    name: 'other',
    label: 'Other positions',
    navLabel: 'Other',
    subsections: [{ name: 'other', label: 'Position' }],
  },
];

export type CategoryResults = Record<string, IPositionSummary[]>;

/**
 * Groups position summaries by category.
 * Positions without categories are added to 'other'.
 */
export function groupPositions(positions: IPositionSummary[]): CategoryResults {
  const categoryResults: CategoryResults = {};
  positionSections.forEach((section) => {
    section.subsections.forEach((subsection) => {
      categoryResults[subsection.name] = [];
    });
  });

  positions.forEach((position) => {
    if (position.categories.length == 0) {
      categoryResults['other'].push(position);
    } else {
      const key = position.categories[0];
      const categoryItems = categoryResults[key];
      if (categoryItems == undefined) {
        categoryResults['other'].push(position);
        console.warn('Unexpected category', key);
      } else {
        categoryItems.push(position);
      }

      if (position.categories.length > 1)
        console.warn('More than one category for position', position.id);
    }
  });
  return categoryResults;
}

export function isSectionEmpty(
  section: PositionSectionDefinition,
  categoryResults: CategoryResults,
) {
  return section.subsections.every((subsection) => {
    const positions = categoryResults[subsection.name];
    return positions == undefined || positions.length == 0;
  });
}

export function caseInsensitiveAlphabetic(
  a: IPositionSummary,
  b: IPositionSummary,
) {
  return a.names[0].toLowerCase() > b.names[0].toLowerCase() ? 1 : -1;
}

export function reverseNumericAlphabetic(
  a: IPositionSummary,
  b: IPositionSummary,
) {
  if (a.counts.total == b.counts.total) return caseInsensitiveAlphabetic(a, b);
  else return b.counts.total - a.counts.total;
}
