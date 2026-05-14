//
// https://developers.google.com/search/docs/advanced/structured-data/
// https://schema.org/WebPage

import { LICENSE_URL, EMAIL } from './constants';
import { EntityData, getFirst } from './types';

function getEveryPoliticianOrganization() {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: 'EveryPolitician',
    url: 'https://everypolitician.org',
    email: EMAIL,
    description:
      'A global atlas of political offices and the people who hold them.',
  };
}

// Escapes `<`, `>`, `&` so attacker-controlled strings (e.g. entity.caption) cannot break out of a JSON-LD <script> block and execute as HTML.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data, null, 2).replace(
    /[<>&]/g,
    (c) => ({ '<': '\\u003c', '>': '\\u003e', '&': '\\u0026' })[c]!,
  );
}

export function getSchemaEntityPage(entity: EntityData) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'WebPage',
    name: entity.caption,
    maintainer: getEveryPoliticianOrganization(),
    license: LICENSE_URL,
    dateCreated: entity.first_seen,
    dateModified: getFirst(entity, 'modifiedAt') || entity.last_seen,
  };
}
