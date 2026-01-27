import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getTerritoryInfo } from '@/lib/territory';

const slugCountryCode = (slug: string) => slug.split('.')[0];

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const countryCode = slugCountryCode(params.slug);
  const info = await getTerritoryInfo(countryCode);
  if (info === null) {
    return {};
  }
  return {
    title: `Data available for ${info.in_sentence}`,
    alternates: { canonical: `/territories/${countryCode}/` },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const countryCode = slugCountryCode(params.slug);
  redirect(`/territories/${countryCode}/national/`);
}
