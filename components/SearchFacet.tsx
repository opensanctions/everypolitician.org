'use client';
import Link from 'next/link';
import queryString from 'query-string';

import { useState } from 'react';
import { Card, CardHeader, ListGroup, ListGroupItem } from './wrapped';
import { ISearchFacet } from "../lib/types";
import { NumericBadge } from "./util";
import { ServerSearchParams } from './utils/PageProps';
import { ensureArray } from '@/lib/util';

import styles from '../styles/Search.module.scss';
import { MAX_FILTERS_PER_FACET } from '@/lib/constants';

type SearchFacetProps = {
  field: string
  facet: ISearchFacet
  searchParams: ServerSearchParams
  limit?: number
  disableLink?: boolean
}

export function SearchFacet({ field, facet, searchParams, limit, disableLink = false }: SearchFacetProps) {
  const [expanded, setExpanded] = useState(limit ? facet.values.length <= limit : true);
  const filters = ensureArray(searchParams[field]);
  const showLink = !disableLink && filters.length < MAX_FILTERS_PER_FACET;

  if (!facet.values.length) {
    return null;
  }

  const filteredUrl = (value: string) => {
    const idx = filters.indexOf(value);
    const newFilters = idx === -1 ? [...filters, value] : filters.filter((e) => e !== value);
    const param = newFilters.length ? newFilters : undefined;
    const newQuery = { ...searchParams, [field]: param };
    return queryString.stringifyUrl({ url: '/search/', query: newQuery });
  }

  const items = (limit == undefined || expanded) ? facet.values : facet.values.slice(0, limit);

  return (
    <div className={styles.facet}>
      <Card>
        <CardHeader>{facet.label}</CardHeader>
        <ListGroup variant="flush">
          {items.map((value) => (
            (showLink || filters.indexOf(value.name) !== -1) ? (
              <ListGroupItem key={value.name}
                active={filters.indexOf(value.name) !== -1}
                as={Link}
                href={filteredUrl(value.name)}
                className={styles.facetListItem}
                prefetch={false}
                rel="nofollow"
              >
                <NumericBadge value={value.count} bg="light" className={styles.facetCount} />
                <span className={styles.facetLabel} title={value.label}>{value.label}</span>
              </ListGroupItem>
            ) : (
              <ListGroupItem key={value.name} title="Cannot add filter.">
                <NumericBadge value={value.count} bg="light" className={styles.facetCount} />
                <span className={styles.facetLabel}>{value.label}</span>
              </ListGroupItem>
            )
          ))}
          {(!expanded && limit && facet.values.length > limit) && (
            <ListGroupItem onClick={(e) => { e.preventDefault(); setExpanded(true) }} className={styles.showAll}>
              Show all...
            </ListGroupItem>
          )}
        </ListGroup>
      </Card>
    </div>
  );
}
