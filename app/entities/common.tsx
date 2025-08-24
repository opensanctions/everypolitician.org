import { BASE_URL } from "@/lib/constants";
import { getEntity, isIndexRelevant } from "@/lib/data";
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
  const noIndex = !isIndexRelevant(entity);
  const canonicalUrl = `${BASE_URL}/entities/${entity.id}/`;
  return getGenerateMetadata({
    title: entity.caption,
    noIndex: noIndex,
    canonicalUrl: noIndex ? null : canonicalUrl
  })
}
