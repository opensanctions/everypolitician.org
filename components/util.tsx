import classNames from 'classnames';
import { filesize } from 'filesize';
import Link from 'next/link';
import queryString from 'query-string';
import React, { ReactNode } from 'react';
import { FileEarmarkCodeFill, Link45deg, QuestionCircleFill, RssFill } from 'react-bootstrap-icons';

import { SPACER } from '../lib/constants';
import { IPaginatedResponse } from '../lib/types';
import { ServerSearchParams } from './utils/PageProps';
import { Badge, Button, NavLink, OverlayTrigger, Pagination, PaginationItem, PaginationNext, PaginationPrev, Spinner, Tooltip } from "./wrapped";

import { Placement } from 'react-bootstrap/esm/types';
import styles from '../styles/util.module.scss';


type RoutedNavLinkProps = {
  href: string
  current?: string
  active?: boolean
}


export function RoutedNavLink({ href, current, active, children }: React.PropsWithChildren<RoutedNavLinkProps>) {
  const matchingPath = href.split('?')[0];
  return (
    <NavLink href={href} active={current == matchingPath}>{children}</NavLink>
  )
}


export function NullValue() {
  return <span className={styles.nullValue}>-</span>;
}


type NumericProps = {
  value?: number | null
  digits?: number
}

export function Numeric({ value, digits }: NumericProps) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
  if (value === undefined || value === null || value === 0 || isNaN(value)) {
    return <NullValue />;
  }
  const options = {
    maximumSignificantDigits: digits,
    minimumSignificantDigits: digits
  } as Intl.NumberFormatOptions;
  const fmt = new Intl.NumberFormat('en-US', options);
  return <span>{fmt.format(value)}</span>;
}

type MoneyProps = {
  value: number
  currency: string
}

export function Money({ value, currency }: MoneyProps) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() });
  return <span>{fmt.format(value)}</span>;
}

type NumericBadgeProps = {
  value?: number | null
  bg?: string
  className?: string
}

export function NumericBadge({ value, bg, className }: NumericBadgeProps) {
  return <Badge bg={bg || 'dark'} className={className}><Numeric value={value} /></Badge>;
}

type PluralProps = {
  value?: number | null
  one: string | ReactNode
  many: string | ReactNode
}


export function Plural({ value, one, many }: PluralProps) {
  const text = value === 1 ? one : many;
  if (value === null || value === undefined) {
    return <>{text}</>;
  }
  return <><Numeric value={value} /> {text}</>;
}


type FileSizeProps = {
  size: number
}


export function FileSize({ size }: FileSizeProps) {
  return <span>{filesize(size, { standard: 'jedec', 'base': 2, locale: 'en-US', output: 'string' }) as string}</span>
}

type MarkdownProps = {
  markdown?: string | null
  className?: string
}

export function Markdown({ markdown, className }: MarkdownProps) {
  if (markdown === undefined || markdown === null || markdown.trim().length == 0) {
    return null;
  }
  //const html = markdownToHtml(markdown);
  return <div
    className={classNames("text-body", className)}
    dangerouslySetInnerHTML={{ __html: markdown }}
  />
}

type FormattedDateProps = {
  date?: string | null
}

export function FormattedDate({ date }: FormattedDateProps) {
  if (date === undefined || date === null) {
    return null;
  }
  // if (date.length <= 10) {
  //   return <time dateTime={date}>{date}</time>
  // }
  // // const obj = new Date(date);
  // try {
  //   // const fmt = new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short' });
  //   // return <time dateTime={date}>{fmt.format(obj)}</time>
  //   const short = date.slice(0, 16).replace('T', ' ');
  //   return <time dateTime={date}>{short}</time>
  // } catch {
  //   return <time dateTime={date}>{date}</time>
  // }
  const short = date.slice(0, 10).replace('T', ' ');
  return <time dateTime={date} className={styles.formattedDate}>{short}</time>
}

type SummaryProps = {
  summary?: string | null
}

export function Summary({ summary }: SummaryProps) {
  if (summary === undefined || summary === null) {
    return null;
  }
  return <p className={styles.summary}>{summary}</p>
}


export function UnofficialBadge({ short = false }: { short?: boolean }) {
  const label = short ? 'non-official' : 'non-official source';
  return <Badge bg="light">{label}</Badge>;
}

export function Sticky({ children }: React.PropsWithChildren) {
  return (
    <div className={styles.stickyParent}>
      <div className={styles.stickyChild}>
        {children}
      </div>
    </div>
  )
}

function getHost(href: string): string {
  try {
    const url = new URL(href);
    return url.hostname;
  } catch (e) {
    return href;
  }
}

type URLLinkProps = {
  url?: string | null
  label?: string
  icon?: boolean
}


export function URLLink({ url, label, icon = true }: URLLinkProps) {
  if (url === undefined || url === null) {
    return !!label ? <>{label}</> : null;
  }
  const href = /^https?:\/\//i.test(url) ? url : `//${url}`;
  const host = getHost(href);
  const textLabel = label || host;
  return (
    <>
      {icon && (
        <a href={href} rel="noreferrer" target="_blank" title={textLabel}>
          <Link45deg className="bsIcon" />
        </a>
      )}
      <a href={href} rel="noreferrer" target="_blank" title={url}>{textLabel}</a>
    </>
  );
}

type HelpLinkProps = {
  href: string
  size?: number
  children?: ReactNode
  tooltipId?: string
  placement?: Placement
}

export function HelpLink({ href, size = 10, children, tooltipId, placement = 'top' }: HelpLinkProps) {
  const link = (
    <a href={href} className={classNames("d-print-none", styles.helpLink)}>
      <sup><QuestionCircleFill size={size} /></sup>
    </a>
  );
  return (
    !!tooltipId
      ? <OverlayTrigger placement={placement} overlay={<Tooltip id={tooltipId} >{children}</Tooltip>} >
        {link}
      </OverlayTrigger>
      : link
  )
}


export function JSONLink({ href }: HelpLinkProps) {
  return (
    <Button
      variant="outline-dark"
      size="sm"
      className={classNames("d-print-none", "d-none", "d-md-block", styles.jsonLink)}
      href={href}
      type={"application/json" as unknown as undefined}  // fuck that's hacky 
    >
      <FileEarmarkCodeFill className="bsIcon" />
      {' '}JSON
    </Button>
  )
}

export function RSSLink({ href }: { href: string }) {
  return (
    <Button
      variant="outline-dark"
      size="sm"
      className={classNames("d-print-none", "d-none", "d-md-block", styles.rssLink)}
      href={href}
      type={"application/rss+xml" as unknown as undefined}  // fuck that's hacky 
    >
      <RssFill className="bsIcon" />
      {' '}RSS
    </Button>
  )
}

type SpacedListProps = {
  values: Array<ReactNode>
}

export function SpacedList({ values }: SpacedListProps) {
  if (values.length == 0) {
    return null;
  }
  return (
    <>
      {values
        .map<React.ReactNode>((t, idx) => <span key={idx}>{t}</span>)
        .reduce((prev, curr, idx) => [prev, <Spacer key={`spacer-${idx}`} />, curr])}
    </>
  )
}

export function SectionSpinner() {
  return (
    <div className={styles.spinner}>
      <Spinner animation="grow" variant="secondary" />
    </div>
  );
}

export function Spacer() {
  return (
    <span className={styles.spacer}>{SPACER}</span>
  )
}

type ExplainProps = {
  tooltip: string
  placement?: string
}

export function Explain({ children, tooltip, placement = 'right' }: React.PropsWithChildren<ExplainProps>) {
  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 10, hide: 50 }}
      overlay={
        <Tooltip id="explain-tooltip">
          <div className={styles.explainContent}>{tooltip}</div>
        </Tooltip>
      }
    >
      <span className={styles.explainAnchor}>{children}</span>
    </OverlayTrigger>
  )
}


type ResponsePaginationProps = {
  response: IPaginatedResponse
  searchParams: ServerSearchParams
}

export function ResponsePagination({ response, searchParams }: ResponsePaginationProps) {
  if (response.total.value === 0) {
    return null;
  }
  const nextOffset = response.offset + response.limit;
  const upper = Math.min(response.total.value, nextOffset);
  const hasPrev = response.offset > 0;
  const hasNext = response.total.value > nextOffset;

  const prevLink = queryString.stringify({
    ...searchParams,
    offset: Math.max(0, response.offset - response.limit)
  })
  const nextLink = queryString.stringify({
    ...searchParams,
    offset: response.offset + response.limit
  })
  const relationText = response.total.relation == 'gte' ? 'more than ' : '';

  return (
    <Pagination>
      <PaginationPrev disabled={!hasPrev} href={`?${prevLink}`} />
      <PaginationItem disabled>
        {response.offset + 1} - {upper} of {relationText} {response.total.value}
      </PaginationItem>
      <PaginationNext disabled={!hasNext} href={`?${nextLink}`} />
    </Pagination>
  );
}

export function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 16)
}
