import Link from 'next/link';
import queryString from 'query-string';
import React from 'react';

import { isBlocked, isIndexRelevant } from '@/lib/data';
import { Entity, Property, Schema } from '@/lib/ftm';
import { compareDisplayProps, pickFeaturedValues } from '@/lib/ftm/ordering';
import { getEntityRiskTopics } from '@/lib/topics';
import { IDataset, IPropResults } from '@/lib/types';

import { HelpLink } from './clientUtil';
import Dataset from './Dataset';
import { PropertyValues } from './Property';
import { FormattedDate, SpacedList } from './util';
import { DetailPopup } from './utils/DetailPopup';
import { Alert, Table } from "./wrapped";

import styles from '@/styles/Entity.module.scss';



interface EntityRawLinkProps {
  entity: Entity
  prop: string
}

function EntityRawLink({ entity, prop }: EntityRawLinkProps) {
  const query = queryString.stringify({
    prop: prop
  })
  return <Link className={styles.rawLink} data-nosnippet prefetch={false} href={`/statements/${entity.id}/?${query}`}>[sources]</Link>
}

export interface EntityDisplayProps {
  entity: Entity
  via?: Property
}

function getEntityPath(entity: Entity): string {
  if (entity.schema.isA('Person')) {
    return `/persons/${entity.id}/`;
  }
  return `/positions/${entity.id}/`;
}

export function EntityLink({ entity, children }: React.PropsWithChildren<EntityDisplayProps>) {
  const href = getEntityPath(entity);
  if (isBlocked(entity)) {
    return <a href={href} rel='nofollow'>[blocked entity]</a>
  }
  const rel = isIndexRelevant(entity) ? '' : 'nofollow';
  const content = children || entity.caption;

  return <a href={href} rel={rel}>{content}</a>
}

function RiskTaggedEntityLink({ entity, children }: React.PropsWithChildren<EntityDisplayProps>) {
  const link = <EntityLink entity={entity}>{children}</EntityLink>;
  const topics = getEntityRiskTopics(entity);
  const prop = entity.schema.getProperty("topics");
  if (topics.length === 0 || prop === undefined) {
    return link;
  }
  return <>{link} <PropertyValues prop={prop} values={topics} /></>;
}

interface EntityPropsTableProps extends EntityDisplayProps {
  entity: Entity
  datasets: Array<IDataset>
  showEmpty?: boolean
  via?: Property
}

function EntityPropsTable({ entity, via, datasets, showEmpty = false }: EntityPropsTableProps) {
  const viaReverse = via?.getReverse();
  const props = entity.getDisplayProperties()
    .filter((p) => viaReverse === undefined || p.qname !== viaReverse.qname)
    // .filter((p) => p.getRange() === undefined)
    .filter((p) => showEmpty || entity.getProperty(p).length > 0)
    .sort(compareDisplayProps);

  const entityDatasets = datasets.filter((d) => entity.datasets.indexOf(d.name) !== -1);
  return (
    <Table className={styles.cardTable} size="sm">
      <tbody>
        {props.map((prop) =>
          <tr key={prop.qname}>
            <th className={styles.cardProp}>{prop.label}</th>
            <td>
              <PropertyValues
                prop={prop}
                values={entity.getProperty(prop)}
                empty="not available"
                limit={5}
                entityComponent={EntityLink}
              />
            </td>
            <td className={styles.rawColumn}>
              <EntityRawLink entity={entity} prop={prop.name} />
            </td>
          </tr>
        )}
        {entityDatasets.length > 0 && (
          <tr key="datasets">
            <th className={styles.cardProp}>Data sources</th>
            <td colSpan={2}>
              <SpacedList values={entityDatasets.map((d) => <Dataset.Link key={d.name} dataset={d} />)} />
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}



type EntityFactsheetProps = {
  entity: Entity
}

export function EntityFactsheet({ entity }: EntityFactsheetProps) {
  const skip = ['notes', 'topics', 'createdAt', 'modifiedAt'];
  const props = entity.getDisplayProperties()
    .filter((p) => p.getRange() === undefined)
    .filter((p) => skip.indexOf(p.name) === -1)
    .sort(compareDisplayProps);

  return (
    <Table className={styles.factsheet}>
      <tbody>
        <tr>
          <th className={styles.cardProp}>Type</th>
          <td colSpan={4}>{entity.schema.label}</td>
          <td className={styles.rawColumn}>
            <EntityRawLink entity={entity} prop="id" />
          </td>
        </tr>
        {props.map((prop) =>
          <tr key={prop.qname}>
            <th className={styles.cardProp}>{prop.label}</th>
            <td colSpan={4}>
              <PropertyValues
                prop={prop}
                values={entity.getProperty(prop)}
                empty="not available"
                limit={5}
                entityComponent={EntityLink}
              />
            </td>
            <td className={styles.rawColumn}>
              <EntityRawLink entity={entity} prop={prop.name} />
            </td>
          </tr>
        )}
        <tr>
          <th className={styles.cardProp}>Last change<HelpLink href="/faq/81/last-change/" /></th>
          <td><FormattedDate date={entity.last_change} /></td>
          <th>Last processed<HelpLink href="/faq/4/update-frequency/" /></th>
          <td><FormattedDate date={entity.last_seen} /></td>
          <th>First seen</th>
          <td><FormattedDate date={entity.first_seen} /></td>
        </tr>
      </tbody>
    </Table>
  )
}

type FeaturedValuesProps = {
  entity: Entity,
  schema: Schema,
  prop: Property
}

function FeaturedValues({ entity, schema, prop }: FeaturedValuesProps) {
  const values = pickFeaturedValues(entity, prop);
  const valuesElement = <PropertyValues
    prop={prop}
    values={values}
    empty="-"
    limit={4}
    entity={entity}
    entityComponent={RiskTaggedEntityLink}
  />;
  if (prop.type.name === 'entity') {
    return valuesElement;
  }
  if (schema.isA('Thing') && schema.caption.indexOf(prop.name) !== -1) {
    return <EntityLink entity={entity}>{valuesElement}</EntityLink>;
  }
  return valuesElement;
}

interface LinkedEntityRowsProps {
  prop: Property
  propResults: IPropResults
  schema: Schema
  featured: Property[]
  datasets: Array<IDataset>
}

function LinkedEntityRows({ prop, propResults, schema, featured, datasets }: LinkedEntityRowsProps) {
  return <>
    {propResults.results.map((entity) => (
      <tr key={entity.id}>
        {featured.map((fprop) => (
          <td key={fprop.name} className={`type-${fprop.type.name}`}>
            <FeaturedValues prop={fprop} entity={entity} schema={schema} />
          </td>
        ))}
        <td style={{ width: 0 }}>
          <DetailPopup title={entity.caption}>
            <EntityPropsTable
              entity={entity}
              datasets={datasets}
              showEmpty={true}
              via={prop}
            />
          </DetailPopup>
        </td>
      </tr>
    ))}
  </>
}

type EntitySchemaTableProps = {
  propResults: IPropResults | undefined,
  datasets: Array<IDataset>,
  prop: Property,
}

export function EntitySchemaTable({ propResults, datasets, prop }: EntitySchemaTableProps) {
  const schema = prop.getRange();
  const reverse = prop.getReverse();
  if (schema === undefined || reverse === undefined || propResults === undefined) {
    return null;
  }
  let featuredNames = schema.featured;
  if (schema.isA('Documentation')) {
    featuredNames = featuredNames.filter((n) => n !== 'role');
    featuredNames.push('date');
  } else if (schema.isA('Interval')) {
    ['startDate', 'endDate'].forEach((p) => {
      if (schema.isA('Interval') && featuredNames.indexOf(p) === -1) {
        featuredNames.push(p);
      }
    })
  }
  if (schema.isA('Address')) {
    featuredNames = ['full', 'country'];
  }
  const featured = featuredNames
    .filter((n) => n !== reverse.name)
    .map((n) => schema.getProperty(n))
    .filter(Property.isProperty);
  return (
    <>
      <a id={`rel.${prop.name}`} />
      <Table bordered size="sm" className="mb-2">
        <thead>
          <tr>
            <th colSpan={featured.length + 1}>
              {prop.label}
              <HelpLink href={`/reference/#schema.${schema.name}`} />
            </th>
          </tr>
          <tr>
            {featured.map((prop) => (
              <th key={prop.name} className={styles.tableHeader}>{prop.label}</th>
            ))}
            <th style={{ width: 0 }}></th>
          </tr>
        </thead>
        <tbody>
          <LinkedEntityRows
            prop={prop}
            propResults={propResults}
            schema={schema}
            featured={featured}
            datasets={datasets}
          />
        </tbody>
      </Table>
    </>
  );
}

interface EntityTopicsProps {
  entity: Entity
}


export function EntityTopics({ entity }: EntityTopicsProps) {
  const prop = entity.schema.getProperty('topics');
  if (prop === undefined) {
    return null;
  }
  const values = entity.getProperty(prop);
  const isSanctioned = values.indexOf('sanction') !== -1;
  const isCounterSanctioned = values.indexOf('sanction.counter') !== -1;
  const isPEP = values.indexOf('role.pep') !== -1;
  const showPEP = !isSanctioned && !isCounterSanctioned && isPEP;
  const isRCA = values.indexOf('role.rca') !== -1;
  const showRCA = (!isSanctioned && !isPEP && isRCA);
  const isOther = (!isSanctioned && !isCounterSanctioned && !isPEP && !isRCA);
  const isPerson = entity.schema.isA("Person");
  const showPersonOther = isOther && isPerson;
  const showEntityOther = isOther && !isPerson;
  let alertVariant = 'light';
  if (isCounterSanctioned) {
    alertVariant = 'warning';
  } else if (isSanctioned) {
    alertVariant = 'warning';
  }
  return (
    <div className={styles.topicsArea}>
      {values.length > 0 && (
        <div className={styles.topicsList}>
          <PropertyValues prop={prop} values={values} />
        </div>
      )}
      <Alert variant={alertVariant} className={styles.topicsNarrative}>
        {isSanctioned && (
          <>
            {entity.caption} is subject to sanctions.
            <> See <a href="#rel.sanctions">the individual program listings</a> below.</>
            {isPEP && (
              <> They are also a <Link href="/pep/">politically exposed person</Link>.</>
            )}
          </>
        )}
        {(isCounterSanctioned && !isSanctioned) && (
          <>
            {entity.caption} is subject to counter-sanctions. Counter-sanctions
            are <strong>designations imposed by countries with weak democratic institutions</strong>.
            They are often punitive responses to foreign sanctions, or can be used to suppress
            domestic political opposition.
            <> See <a href="#rel.sanctions">the individual program listings</a> below.</>
            {isPEP && (
              <> They are also a <Link href="/pep/">politically exposed person</Link>.</>
            )}
          </>
        )}
        {showPEP && (
          <>
            {entity.caption} is a <Link href="/pep/">politically exposed person</Link>.
            They are a <Link href="/faq/22/poi/">person of interest</Link>  by virtue of their
            position and the influence they may hold. They have not been found on international
            sanctions lists.
          </>
        )}
        {showRCA && (
          <>
            {entity.caption} is a family member or associate of a <Link href="/pep/">politically exposed person</Link>.
            They have not been found on international sanctions lists.
          </>
        )}
        {showPersonOther && (
          <>
            {entity.caption} is a <Link href="/faq/22/poi/">person of interest</Link>.
            They have not been found on international sanctions lists.
          </>
        )}
        {showEntityOther && (
          <>
            {entity.caption} is an <Link href="/faq/22/poi/">entity of interest</Link>.
            It has not been found on international sanctions lists.
          </>
        )}
      </Alert>
    </div>
  );
}
