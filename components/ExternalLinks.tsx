import { EntityData, getFirst } from '@/lib/types';

export default function ExternalLinks({ entity }: { entity: EntityData }) {
  const wikidataId = getFirst(entity, 'wikidataId');

  if (!wikidataId) {
    return null;
  }

  return (
    <section id="external-links" className="mb-5">
      <h2>External links</h2>
      <ul>
        <li>
          <a
            href={`https://www.wikidata.org/wiki/${wikidataId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WikiData ({wikidataId})
          </a>
        </li>
      </ul>
    </section>
  );
}
