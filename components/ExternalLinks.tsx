import { BoxArrowUpRight } from 'react-bootstrap-icons';

import { EntityData, getFirst } from '@/lib/types';

export default function ExternalLinks({ entity }: { entity: EntityData }) {
  const wikidataId = getFirst(entity, 'wikidataId');

  if (!wikidataId) {
    return null;
  }

  return (
    <span className="ms-auto d-flex gap-3">
      <a
        href={`${process.env.NEXT_PUBLIC_POLILOOM_URL}/politician/${wikidataId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fs-6 fw-normal"
      >
        View on PoliLoom <BoxArrowUpRight size={12} />
      </a>
      <a
        href={`https://www.wikidata.org/wiki/${wikidataId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fs-6 fw-normal"
      >
        View on Wikidata <BoxArrowUpRight size={12} />
      </a>
    </span>
  );
}
