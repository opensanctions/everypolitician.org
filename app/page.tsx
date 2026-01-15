import Link from 'next/link';

import { Hero } from '@/components/Hero';
import LayoutFrame from '@/components/layout/LayoutFrame';
import WorldMap from '@/components/WorldMap';
import Container from 'react-bootstrap/Container';
import { getMapCountryData } from '@/lib/data';

import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'EveryPolitician: Who is running the world?',
  description:
    'EveryPolitician is a global database of political office-holders, from rulers, law-makers to judges and more.',
  alternates: { canonical: '/' },
};

export default async function Page() {
  const countryDataArray = await getMapCountryData();

  return (
    <LayoutFrame activeSection="research">
      <Hero
        title="Who is running the world?"
        size="large"
        background={<WorldMap countryDataArray={countryDataArray} />}
      >
        <p className="hero-subtitle">
          EveryPolitician is a global database of political office-holders, from
          rulers, law-makers to judges and more.
        </p>
      </Hero>
      <Container className="pt-3">
        <h2>Understanding who holds power</h2>
        <p>
          In any democracy, citizens should be able to find out who represents
          them and who makes decisions on their behalf. EveryPolitician aims to
          be a comprehensive resource for anyone researching political
          office-holders—whether you&apos;re a journalist investigating public
          officials, a researcher studying political systems, or a citizen
          learning about your representatives.
        </p>
        <p>
          We track{' '}
          <Link href="/docs/methodology/#types">a wide range of roles</Link>:
          members of cabinets and parliaments, senior public servants, judges,
          military leaders, and executives of state-owned enterprises. Our goal
          is to make this information accessible and useful to everyone.
        </p>

        <h2>Our approach</h2>
        <p>
          We believe that information about political office-holders should be
          freely available. By{' '}
          <strong>mapping out the political positions</strong> that exist in
          each country, we can measure how complete our coverage is and identify
          gaps that need filling.
        </p>
        <p>
          Rather than manually tracking elections and appointments, we focus on
          collecting data from official sources and contributing back to
          community projects like{' '}
          <Link href="https://www.wikidata.org/">Wikidata</Link>. This way, the
          information becomes a shared resource that anyone can use and improve.
        </p>
        <p>
          Read more about our <Link href="/docs/methodology/">methodology</Link>
          .
        </p>

        <h2>Where does the data come from?</h2>
        <p>
          We automatically collect data from official government sources—lists
          of parliamentarians, cabinet members, judges, and other public
          officials. We also draw on global databases of world leaders and
          enrich profiles with{' '}
          <Link href={'/docs/enrichment/'}>additional context</Link> where
          available.
        </p>
        <p>
          <Link href="/datasets/">Browse all data sources</Link>
        </p>

        <h2>Using the data</h2>
        <p>
          You can browse politicians by country on this site, or access the data
          programmatically via the{' '}
          <a href="https://opensanctions.org/api/">API</a>. Bulk downloads are
          available through{' '}
          <a href="https://opensanctions.org/datasets/peps/">OpenSanctions</a>.
        </p>

        <h2>Get involved</h2>
        <p>
          EveryPolitician is a community effort. Here&apos;s how you can
          contribute:
        </p>
        <ul className="spaced">
          <li>
            <strong>Add or improve politician profiles</strong> by contributing
            to Wikidata&apos;s{' '}
            <Link href="https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician">
              WikiProject Every Politician
            </Link>
            . Like all Wikipedia projects, it has community review and
            verification standards. Start by exploring the{' '}
            <Link href="https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician/Political_data_model">
              political data model
            </Link>
            . Edits typically appear here within a few days.
          </li>
          <li>
            <strong>Build a data crawler</strong> for an official source we
            don&apos;t yet cover. Our crawlers are{' '}
            <Link href="https://github.com/opensanctions/opensanctions/tree/main/datasets">
              open source
            </Link>{' '}
            and use the zavod framework (Python). See our{' '}
            <Link href="https://bit.ly/osa-sources">data source wishlist</Link>{' '}
            for inspiration and the{' '}
            <Link href="https://zavod.opensanctions.org/tutorial/">
              tutorial
            </Link>{' '}
            to get started.
          </li>
          <li>
            <strong>Partner with us</strong> on research or data projects.{' '}
            <Link href="/contact/">Get in touch</Link> to discuss collaboration
            opportunities.
          </li>
        </ul>
      </Container>
    </LayoutFrame>
  );
}
