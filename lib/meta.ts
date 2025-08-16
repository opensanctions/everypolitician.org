import { Metadata } from "next"
import { BASE_URL, RSS_MIME, SOCIAL_IMAGE_URL } from "./constants"


type MetaProps = {
  title: string
  description?: string
  imageUrl?: string | null,
  canonicalUrl?: string | null,
  rssUrl?: string | null,
  noIndex?: boolean
}

export function getGenerateMetadata({ title, description, imageUrl, canonicalUrl, rssUrl, noIndex }: MetaProps): Metadata {
  const imageDefaultUrl = !!imageUrl ? imageUrl : SOCIAL_IMAGE_URL;
  const alternateTypes: any = {}
  if (!!rssUrl) {
    alternateTypes[RSS_MIME] = rssUrl;
  }
  const meta: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: title,
    description: description,
    applicationName: 'EveryPolitician.org',
    creator: "OpenSanctions",
    icons: {
      icon: 'https://assets.opensanctions.org/images/favicon-32x32.png',
      apple: 'https://assets.opensanctions.org/images/apple-touch-icon.png'
    },
    alternates: {
      canonical: canonicalUrl,
      types: alternateTypes,
    },
    openGraph: {
      title: title,
      description: description,
      siteName: "EveryPolitician.org",
      images: [{ url: imageDefaultUrl }],
    },
    robots: {
      index: !noIndex
    },
  }
  return meta;
}
