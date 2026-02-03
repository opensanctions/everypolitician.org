import { BoxArrowUpRight } from 'react-bootstrap-icons';

import { EntityData, getFirst } from '@/lib/types';

export default function ExternalLinks({ entity }: { entity: EntityData }) {
  const wikidataId = getFirst(entity, 'wikidataId');

  if (!wikidataId) {
    return null;
  }

  return (
    <a
      href={`https://www.wikidata.org/wiki/${wikidataId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="ms-auto fs-6 fw-normal"
    >
      View on Wikidata <BoxArrowUpRight size={12} />
    </a>
  );
}
