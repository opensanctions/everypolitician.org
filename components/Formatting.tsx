import React, { ReactNode } from 'react';

import { SPACER } from '../lib/constants';

function NullValue() {
  return <span className="text-muted">-</span>;
}

type NumericProps = {
  value?: number | null;
  digits?: number;
};

export function Numeric({ value, digits }: NumericProps) {
  if (value === undefined || value === null || value === 0 || isNaN(value)) {
    return <NullValue />;
  }
  const options = {
    maximumSignificantDigits: digits,
    minimumSignificantDigits: digits,
  } as Intl.NumberFormatOptions;
  const fmt = new Intl.NumberFormat('en-US', options);
  return <span>{fmt.format(value)}</span>;
}

type PluralProps = {
  value?: number | null;
  one: string | ReactNode;
  many: string | ReactNode;
};

export function Plural({ value, one, many }: PluralProps) {
  const text = value === 1 ? one : many;
  if (value === null || value === undefined) {
    return <>{text}</>;
  }
  return (
    <>
      <Numeric value={value} /> {text}
    </>
  );
}

type FormattedDateProps = {
  date?: string | null;
};

export function FormattedDate({ date }: FormattedDateProps) {
  if (date === undefined || date === null) {
    return null;
  }
  const short = date.slice(0, 10).replace('T', ' ');
  return (
    <time dateTime={date} className="text-nowrap">
      {short}
    </time>
  );
}

export function Sticky({ children }: React.PropsWithChildren) {
  return (
    <div className="h-100 position-relative">
      <div className="position-sticky" style={{ top: '2rem' }}>
        {children}
      </div>
    </div>
  );
}

export function Spacer() {
  return <span className="fw-bolder">{SPACER}</span>;
}

type SpacedListProps = {
  values: Array<ReactNode>;
};

export function SpacedList({ values }: SpacedListProps) {
  if (values.length == 0) {
    return null;
  }
  return (
    <>
      {values
        .map<React.ReactNode>((t, idx) => <span key={idx}>{t}</span>)
        .reduce((prev, curr, idx) => [
          prev,
          <Spacer key={`spacer-${idx}`} />,
          curr,
        ])}
    </>
  );
}
