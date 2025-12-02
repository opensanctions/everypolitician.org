import { BASE_URL } from "@/lib/constants";
import { getEntity, isBlocked, isIndexRelevant } from "@/lib/data";
import { getGenerateMetadata } from "@/lib/meta";

export interface EntityPageProps {
  params: Promise<{ entityId: string }>
}

interface EntityMetadataProps extends EntityPageProps {
  title?: string
}

export async function generateEntityMetadata({ params, title }: EntityMetadataProps) {
  const entity = await getEntity((await params).entityId);
  if (entity === null) {
    return getGenerateMetadata({
      title: "Entity not found"
    });
  }
  title = isBlocked(entity) ? 'Blocked entity' : title || entity.caption;
  const noIndex = !isIndexRelevant(entity);
  const canonicalUrl = `${BASE_URL}/entities/${entity.id}/`;
  return getGenerateMetadata({
    title: title,
    noIndex: noIndex,
    canonicalUrl: noIndex ? null : canonicalUrl
  })
}
