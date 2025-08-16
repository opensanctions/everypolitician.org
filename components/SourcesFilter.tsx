'use client';

import Link from "next/link";
import classNames from 'classnames';
import queryString from "query-string";
import { useRouter } from 'next/navigation';

import { Row, Col, FormCheck, FormSelect, FormGroup, FormText } from './wrapped';

import styles from '../styles/Dataset.module.scss';

export type SourceFilterScope = {
  name: string;
  title: string;
};

type SourceFilterProps = {
  scopes: Array<SourceFilterScope>;
  scopeName: string;
  showLatest: boolean;
};

export function SourcesFilter({ scopes, scopeName, showLatest }: SourceFilterProps) {
  const router = useRouter();

  const pushQuery = (scope: string, showLatest: boolean) => {
    const query = queryString.stringify({
      scope,
      latest: showLatest + '',
    })
    router.push(`?${query}`);
  };

  return (
    <Row className={classNames('d-print-none', styles.sourcesFilter)}>
      <Col md="6">
        <FormGroup controlId="collection">
          <FormSelect
            aria-label="Filter data sources by collection"
            value={scopeName}
            onChange={(e) => pushQuery(e.target.value, showLatest)}
          >
            {scopes.map((s) => (
              <option key={s.name} value={s.name}>
                {s.title}
              </option>
            ))}
          </FormSelect>
          <FormText muted>
            Filter the list of <Link href="/faq/20/datasets/">data sources</Link> by <Link href="/faq/21/collections/">collection</Link>
          </FormText>
        </FormGroup>
      </Col>
      <Col md="3">
        <FormCheck
          type="switch"
          checked={showLatest}
          onChange={(e) => pushQuery(scopeName, e.target.checked)}
          label="Show recent additions first"
        />
      </Col>
      <Col md="3">
        <ul>
          <li><Link href="/docs/criteria/">Inclusion criteria</Link></li>
          <li><Link href="/docs/opensource/contributing/">Roadmap/contributions</Link></li>
        </ul>
      </Col>
    </Row>
  );
}