import queryString from "query-string";

import { getEntityRiskTopics } from '@/lib/topics';
import { MAIN_DATASET, SEARCH_SCHEMA } from "@/lib/constants";
import { IEntityDatum, Values } from '@/lib/ftm';
import { Model } from '../lib/ftm/model';
import { ICatalogEntry } from "../lib/types";
import { arrayFirst, ensureArray } from '../lib/util';


import { EntityLink } from './Entity';
import { TypeValue, TypeValues } from './Property';
import { Spacer } from "./util";
import { ServerSearchParams } from './utils/PageProps';
import { Badge } from './wrapped';

import styles from '@/styles/Search.module.scss';


type SearchFilterTagsProps = {
  model: Model
  scope: ICatalogEntry
  datasets: Array<ICatalogEntry>
  searchParams: ServerSearchParams
}

export function SearchFilterTags({ scope, model, datasets, searchParams }: SearchFilterTagsProps) {
  const unfilterUrl = (field: string, value: string) => {
    const values = ensureArray(searchParams[field]).filter((v) => v !== value);
    const newQuery = { ...searchParams, [field]: values }
    return queryString.stringifyUrl({ url: '/search/', query: newQuery });
  }
  const filters = [];
  const schema = arrayFirst(searchParams['schema']);
  if (schema !== undefined && schema !== SEARCH_SCHEMA && model.hasSchema(schema)) {
    filters.push({
      'field': 'schema',
      'value': schema,
      'label': model.getSchema(schema).plural
    })
  }
  if (scope.name !== MAIN_DATASET) {
    filters.push({
      'field': 'scope',
      'value': scope.name,
      'label': scope.title
    })
  }
  const countries = ensureArray(searchParams['countries']);
  const countryType = model.getType('country');
  for (let country of countries) {
    if (country.trim().length) {
      filters.push({
        'field': 'countries',
        'value': country,
        'label': <TypeValue type={countryType} value={country} plain={true} />
      })
    }
  }

  const topics = ensureArray(searchParams['topics']);
  const topicType = model.getType('topic');
  for (let topic of topics) {
    if (topic.trim().length) {
      filters.push({
        'field': 'topics',
        'value': topic,
        'label': <TypeValue type={topicType} value={topic} plain={true} />
      })
    }
  }

  const datasetNames = ensureArray(searchParams['datasets']);
  for (let dataset of datasetNames) {
    const ds = datasets.find((d) => d.name == dataset)
    if (ds !== undefined) {
      filters.push({
        'field': 'datasets',
        'value': dataset,
        'label': ds.title
      })
    }
  }

  if (filters.length === 0) {
    return null;
  }
  return (
    <p className={styles.tagsSection}>
      <Badge bg="light">Filtered:</Badge>{' '}
      {filters.map((spec) =>
        <span key={`${spec.field}:${spec.value}`}>
          <a href={unfilterUrl(spec.field, spec.value)}>
            <Badge className={styles.tagsButton}>
              {spec.label}
            </Badge>
          </a>
          {' '}
        </span>
      )}
    </p>
  )
}

type SearchResultEntityProps = {
  data: IEntityDatum
  model: Model
}

export function SearchResultEntity({ data, model }: SearchResultEntityProps) {
  const entity = model.getEntity(data);
  const countryType = model.getType('country');
  const countries = entity.getTypeValues(countryType) as Values;
  const topicType = model.getType('topic');
  const topics = getEntityRiskTopics(entity, true);
  return (
    <li key={entity.id} className={styles.resultItem}>
      <div className={styles.resultTitle}>
        <EntityLink entity={entity} />
      </div>
      <p className={styles.resultDetails}>
        <Badge bg="light">{entity.schema.label}</Badge>
        {topics.length > 0 && (
          <>
            <Spacer />
            <TypeValues type={topicType} values={topics} />
          </>
        )}
        {countries.length > 0 && (
          <>
            <Spacer />
            <TypeValues type={countryType} values={countries} />
          </>
        )}
      </p>
    </li>
  );
}
