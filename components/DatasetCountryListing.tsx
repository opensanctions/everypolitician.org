'use client';

import { useState } from 'react';

import { IAggregatedCountry } from '@/lib/datasets';

import { HelpLink } from './clientUtil';
import { Numeric, Plural, Spacer } from './util';
import { Table } from './wrapped';

type DatasetCountryListingProps = {
  datasetName: string;
  countries: IAggregatedCountry[];
  defaultLimit?: number | null;
  defaultExpanded?: boolean;
  isNested?: boolean;
};

export default function DatasetCountryListing({
  datasetName,
  countries,
  defaultLimit = null,
  isNested = true,
  defaultExpanded = false,
}: DatasetCountryListingProps) {
  const alwaysExpanded = defaultExpanded || countries.length < 6;
  const [coverageExpanded, setCoverageExpanded] = useState(alwaysExpanded);
  const [limit, setLimit] = useState(defaultLimit);
  const visibleCountries =
    typeof limit == 'number' ? countries.slice(0, limit - 1) : countries;

  return (
    <>
      <Table size="sm" className={isNested ? 'inner-table' : ''}>
        {!alwaysExpanded && (
          <thead>
            <tr>
              <td colSpan={2}>
                <Plural
                  value={countries.length}
                  one="country"
                  many="countries"
                />
                <HelpLink href={`/reference/#type.country`} />
                {coverageExpanded && (
                  <>
                    <Spacer />
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setCoverageExpanded(false);
                      }}
                      href="#"
                    >
                      Hide overview...
                    </a>
                  </>
                )}
                {!coverageExpanded && (
                  <>
                    <Spacer />
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setCoverageExpanded(true);
                      }}
                      href="#"
                    >
                      Show overview...
                    </a>
                  </>
                )}
              </td>
            </tr>
          </thead>
        )}
        <tbody>
          {coverageExpanded &&
            visibleCountries.map((c) => (
              <tr key={c.code}>
                <td>{c.label}</td>
                <td className="numeric">
                  <Numeric value={c.count} />
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {coverageExpanded && limit !== null && (
        <a
          onClick={(e) => {
            e.preventDefault();
            setLimit(null);
          }}
          href="#"
        >
          Show all...
        </a>
      )}
    </>
  );
}
