import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getTerritories } from '@/lib/territory';

const slugCountryCode = (slug: string) => slug.split('.')[0];

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const countryCode = slugCountryCode(params.slug);
  const territories = await getTerritories();
  const territory = territories.find((t) => t.code === countryCode);
  if (!territory) {
    return {};
  }
  return {
    title: `Data available for ${territory.name}`,
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
