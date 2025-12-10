import { Entity, Values } from "./entity";
import { Property } from "./property";

interface WeightsType {
  [name: string]: number
}

const WEIGHTS = {
  name: -10000,
  alias: -9999,
  weakAlias: -9998,
  birthDate: -8000,
  birthPlace: -7990,
  deathDate: -7980,
  gender: -7980,
  incorporationDate: -7700,
  dissolutionDate: -7690,
  legalForm: -7600,

  nationality: - 5900,
  jurisdiction: -5890,
  country: -5880,

  sanctions: -3000,

  position: 900,
  education: 1000,
  religion: 1010,
  ethnicity: 1020,
  status: 2000,
  address: 4000,
  publisher: 18000,
  sourceUrl: 19000,
  createdAt: 20000,
  modifiedAt: 20001,
} as WeightsType

function getPropWeight(prop: Property): number {
  return WEIGHTS[prop.name] || 0;
}

export function compareDisplayProps(a: Property, b: Property): number {
  const weights = getPropWeight(a) - getPropWeight(b);
  return weights || a.label.localeCompare(b.label);
}

export function pickFeaturedValues(entity: Entity, prop: Property): Values {
  const values = [...entity.getProperty(prop)];
  if (values.length === 0) {
    return values;
  }
  const stringValues = values as string[];
  if (entity.schema.getTemporalStartPropNames().indexOf(prop.name) !== -1) {
    return [stringValues.sort((a, b) => a.localeCompare(b))[0]];
  }
  if (entity.schema.getTemporalEndPropNames().indexOf(prop.name) !== -1) {
    const value = stringValues.sort((a, b) => a.localeCompare(b)).pop();
    return value ? [value] : values;
  }
  return values;
}
