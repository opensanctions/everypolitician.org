The EveryPolitician (EP) website presents a global atlas of political offices associated with a wide range of territories (countries, subnational jurisdictions, and break-away states). For each position, office-holders are listed to indicate the periods in which they held tenure of a position.

- The website is meant to be a community-driven resource. For any copy, use the tone of projects like Wikipedia, WhatDoTheyKnow, Code For America.

### Technology

- Using Next.js, TypeScript, and running on Google Cloud Run.
  - Assume a development server is available at http://localhost:4000
  - Components are used for any re-usable elements and located in `components/`
  - Data interfaces and access functions are in `lib/`
- Searches and other API requests can be sent against the OpenSanctions API at api.opensanctions.org.
  - This contains Person, Position and Occupancy entities relevant to EP
  - see: https://api.opensanctions.org/openapi.json
- Main entity schemata:
  - https://followthemoney.tech/explorer/schemata/Person/
  - https://followthemoney.tech/explorer/schemata/Position/
  - https://followthemoney.tech/explorer/schemata/Occupancy/
