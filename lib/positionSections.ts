import { PositionSummary } from '@/lib/data';

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

export type CategoryResults = Record<string, PositionSummary[]>;

// Priority order for selecting the most salient category when a position has multiple.
// Lower index = higher priority. Head of state/gov wins, then diplo over generic exec/legis.
const categoryPriority: string[] = [
  'nat-head',
  'diplo',
  'int',
  'nat-exec',
  'nat-legis',
  'nat-sec',
  'nat-fin',
  'nat-judicial',
  'soe',
  'subnat-head',
  'subnat-exec',
  'subnat-legis',
  'subnat-judicial',
  'other',
];

/**
 * Selects the most salient category from an array of categories.
 * Uses priority order: head of gov > diplo > other national roles > subnational.
 */
export function selectPrimaryCategory(categories: string[]): string {
  if (categories.length === 0) return 'other';
  return categoryPriority.find((c) => categories.includes(c)) ?? categories[0];
}

/**
 * Groups position summaries by category.
 * Positions without categories are added to 'other'.
 */
export function groupPositions(positions: PositionSummary[]): CategoryResults {
  const categoryResults: CategoryResults = {};
  positionSections.forEach((section) => {
    section.subsections.forEach((subsection) => {
      categoryResults[subsection.name] = [];
    });
  });

  positions.forEach((position) => {
    const key = selectPrimaryCategory(position.categories);
    const categoryItems = categoryResults[key];
    if (categoryItems == undefined) {
      categoryResults['other'].push(position);
      console.warn('Unexpected category', key);
    } else {
      categoryItems.push(position);
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
  a: PositionSummary,
  b: PositionSummary,
) {
  return a.names[0].toLowerCase() > b.names[0].toLowerCase() ? 1 : -1;
}

export function reverseNumericAlphabetic(
  a: PositionSummary,
  b: PositionSummary,
) {
  if (a.counts.total == b.counts.total) return caseInsensitiveAlphabetic(a, b);
  else return b.counts.total - a.counts.total;
}
