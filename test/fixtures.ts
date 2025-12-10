/**
 * Test fixtures - realistic API responses for behavior tests.
 * These mock data at the system boundary (fetch) rather than internal modules.
 */

// Territory data (from CMS)
export const territories = {
  data: [
    {
      code: 'us',
      label_short: 'United States',
      label_full: 'United States of America',
      in_sentence: 'the United States',
      flag: '🇺🇸',
      region: 'Americas',
      subregion: 'North America',
      summary: 'A federal republic in North America.',
      dissolved: false,
      date_created: '2024-01-01',
      date_updated: '2024-01-01',
      see: [],
    },
    {
      code: 'gb',
      label_short: 'United Kingdom',
      label_full: 'United Kingdom of Great Britain and Northern Ireland',
      in_sentence: 'the United Kingdom',
      flag: '🇬🇧',
      region: 'Europe',
      subregion: 'Northern Europe',
      summary: null,
      dissolved: false,
      date_created: '2024-01-01',
      date_updated: '2024-01-01',
      see: [],
    },
  ],
}

// Dataset index (from data.opensanctions.org)
export const pepsDataset = {
  name: 'peps',
  title: 'Politically Exposed Persons',
  type: 'collection',
  hidden: false,
  datasets: ['us_ofac', 'gb_hmt'],
  publisher: null,
}

export const defaultDataset = {
  name: 'default',
  title: 'Default Dataset',
  type: 'collection',
  hidden: false,
  datasets: ['peps', 'sanctions'],
  publisher: null,
}

// Search API response
export const searchResponse = {
  total: 100,
  results: [],
  facets: {
    countries: {
      label: 'Countries',
      values: [
        { name: 'us', label: 'United States', count: 50 },
        { name: 'gb', label: 'United Kingdom', count: 30 },
      ],
    },
    topics: {
      label: 'Topics',
      values: [
        { name: 'role.pep', label: 'Politically Exposed Person', count: 40 },
        { name: 'role.rca', label: 'Relative or Close Associate', count: 20 },
      ],
    },
    schema: {
      label: 'Type',
      values: [
        { name: 'Person', label: 'Person', count: 80 },
        { name: 'Company', label: 'Company', count: 20 },
      ],
    },
  },
}

// Entity API response
export const personEntity = {
  id: 'Q123',
  caption: 'John Smith',
  schema: 'Person',
  datasets: ['peps'],
  referents: [],
  properties: {
    name: ['John Smith'],
    country: ['us'],
    topics: ['role.pep'],
  },
}

// FTM model (from data.opensanctions.org)
export const ftmModel = {
  schemata: {
    Person: {
      name: 'Person',
      label: 'Person',
      plural: 'People',
      extends: ['Thing', 'LegalEntity'],
      properties: {
        name: { name: 'name', label: 'Name', type: 'name' },
        country: { name: 'country', label: 'Country', type: 'country' },
        topics: { name: 'topics', label: 'Topics', type: 'topic' },
      },
    },
    Position: {
      name: 'Position',
      label: 'Position',
      plural: 'Positions',
      extends: ['Thing'],
      properties: {
        name: { name: 'name', label: 'Name', type: 'name' },
        country: { name: 'country', label: 'Country', type: 'country' },
      },
    },
    Occupancy: {
      name: 'Occupancy',
      label: 'Occupancy',
      plural: 'Occupancies',
      extends: ['Thing'],
      properties: {},
    },
  },
  types: {},
}

// Country PEP data (from data.opensanctions.org)
export const countryPepData = {
  positions: [
    {
      id: 'pos-1',
      names: ['President'],
      categories: ['nat-head'],
      counts: { total: 5, current: 1, ended: 3, unclear: 1 },
    },
    {
      id: 'pos-2',
      names: ['Senator'],
      categories: ['nat-legis'],
      counts: { total: 100, current: 50, ended: 40, unclear: 10 },
    },
  ],
}

// Dataset statistics
export const datasetStatistics = {
  things: {
    countries: [
      { code: 'us', count: 1000 },
      { code: 'gb', count: 500 },
    ],
  },
}

/**
 * Helper to create a JSON Response
 */
export function jsonResponse(data: unknown, status = 200): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  )
}

/**
 * Helper to create a binary Response (for assets)
 */
export function binaryResponse(
  data: Buffer | ArrayBuffer,
  contentType = 'application/octet-stream',
  contentDisposition?: string
): Promise<Response> {
  const headers: Record<string, string> = { 'Content-Type': contentType }
  if (contentDisposition) {
    headers['Content-Disposition'] = contentDisposition
  }
  return Promise.resolve(new Response(data, { status: 200, headers }))
}
