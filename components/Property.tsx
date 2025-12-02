import Link from 'next/link';
import { ComponentType } from 'react';

import { Entity, Property, PropertyType, Value, Values } from "../lib/ftm";

import { EntityDisplayProps, EntityLink } from "./Entity";
import { FormattedDate, SpacedList, URLLink } from "./util";
import { ExpandList } from './utils/ExpandList';
import { Badge } from "./wrapped";


type TypeValueProps = {
  type: PropertyType
  value: Value
  plain?: boolean
  prop?: Property
  entityComponent?: ComponentType<EntityDisplayProps>
}

export function TypeValue({ type, value, plain = false, entityComponent: Entity = EntityLink, prop }: TypeValueProps) {
  const strValue = value + '';
  if (type.name == 'country') {
    return <>{type.values.get(strValue) || strValue}</>
  }
  if (type.name == 'language') {
    return <>{type.values.get(strValue) || strValue}</>
  }
  if (type.name === 'date') {
    return <FormattedDate date={strValue} />
  }
  if (type.name === 'url' && !plain) {
    return <URLLink url={strValue} />
  }
  if (prop?.name == 'leiCode') {
    return <Link href={`https://search.gleif.org/#/record/${value}`}>{strValue}</Link>
  }
  if (prop?.name === 'wikidataId') {
    return <Link href={`https://wikidata.org/wiki/${value}`}>{strValue}</Link>
  }
  if (type.name === 'identifier' && !plain) {
    return <code>{strValue}</code>
  }
  if (type.name === 'topic') {
    const label = type.values.get(strValue) || strValue;
    if (plain) {
      return <>{label}</>;
    } else {
      return <Badge bg="warning">{label}</Badge>
    }
  }
  if (type.name === 'entity' && !plain) {
    if (typeof (value) !== 'string') {
      return <Entity entity={value as Entity} via={prop} />
    }
    return <code>{strValue}</code>
  }
  return <>{strValue}</>
}

type TypeValuesProps = {
  type: PropertyType
  values: Values
  limit?: number
  prop?: Property
  empty?: string
  entityComponent?: ComponentType<EntityDisplayProps>
}

export function TypeValues({ type, values, entityComponent, prop, limit, empty }: TypeValuesProps) {
  const elems = values.sort().map((v, i) => <TypeValue key={i} type={type} value={v} entityComponent={entityComponent} prop={prop} />)
  if (elems.length === 0 && empty) {
    return <span className="text-muted">{empty}</span>
  }
  if (limit !== undefined && limit < elems.length) {
    const shortElems = elems.slice(0, limit);
    const moreCount = elems.length - limit;
    const moreText = <>{`${moreCount} more...`}</>
    return (
      <ExpandList
        short={<SpacedList values={shortElems} />}
        full={<SpacedList values={elems} />}
        moreText={moreText}
      />
    );
  }
  return <SpacedList values={elems} />
}

type PropertyValueProps = {
  prop: Property
  value: Value
  entity?: ComponentType<EntityDisplayProps>
}

export function PropertyValue({ prop, value, entity }: PropertyValueProps) {
  return <TypeValue type={prop.type} value={value} entityComponent={entity} prop={prop} />
}

type PropertyValuesProps = {
  prop: Property
  values: Values
  limit?: number
  empty?: string
  entity?: Entity
  entityComponent?: ComponentType<EntityDisplayProps>
}


export function PropertyValues(componentProps: PropertyValuesProps) {
  const { prop, values, entityComponent, limit, empty } = componentProps
  return (
    <TypeValues
      type={prop.type}
      values={values}
      limit={limit}
      entityComponent={entityComponent}
      empty={empty}
      prop={prop}
    />
  );
}
