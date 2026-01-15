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
        <h2>What are Politically Exposed Persons?</h2>
        <p>
          Politically exposed persons (PEP) is a term from the financial
          services industry to describe individuals who have been entrusted with
          a prominent public function. This{' '}
          <Link href="/docs/pep/methodology/#types">might include</Link> members
          of cabinets, parliaments, senior public servants and military
          personnel, or managers of state-owned companies.
        </p>
        <p>
          Being classified as a PEP <strong>does not</strong> imply any
          misconduct. However, the concept is important because PEPs and members
          of their families should be the subject of enhanced public scrutiny.
          Identifying PEPs and conducting enhanced due diligence on the origins
          of their wealth is mandated by financial crime laws in most countries.
        </p>

        <h2>Our take on PEP data</h2>
        <p>
          The scope of PEP data is less well-defined compared to anti-money
          laundering datasets such as sanctions lists. Our goal is therefore to
          make the scope and depth of our data coverage transparent and publish
          the <Link href="/docs/pep/methodology">underlying methodology</Link>.
        </p>
        <p>
          By <strong>mapping out the political positions</strong> that should be
          included on a country-by-country basis, we define quality metrics that
          measure coverage across time, jurisdiction and level of government.
        </p>
        <p>
          We focus on automating the collection of PEP data rather than relying
          on the manual monitoring political events and election results. Our
          ultimate objective is to help expand the coverage of political persons
          in community-driven data resources like{' '}
          <Link href="https://www.wikidata.org/">Wikidata</Link>. This way, the
          information ultimately becomes a commodity, produced via a distributed
          process.
        </p>

        <h2>Where is our PEP data sourced from?</h2>
        <p>
          OpenSanctions automatically monitors and imports global databases into
          our data, such as lists of world leaders. We are also expanding our
          coverage of nationally published data, such as lists of
          parliamentarians or state governors. We{' '}
          <Link href={'/docs/enrichment/'}>enrich the PEP data</Link> with
          further information about the potential influence of officeholders,
          e.g. to reflect a person holding both a public office and running a
          business.
        </p>
        <p>
          <Link href="/datasets/">Browse all PEP data sets</Link>
        </p>

        <h2>How do I use the data?</h2>
        <p>
          You can{' '}
          <a href="https://opensanctions.org/datasets/peps/">
            download the PEP bulk data
          </a>{' '}
          or look up individual entries using the{' '}
          <a href="https://opensanctions.org/api/">API</a>. Commercial users can
          license the dataset as part of the OpenSanctions{' '}
          <Link href="/licensing/">bulk data license</Link>. We do not offer a
          separate licensing option for PEPs data alone.
        </p>
        <p>
          Our{' '}
          <Link href="/docs/pep/methodology">
            methodology documentation explains
          </Link>{' '}
          how PEP position information can be used to select custom subsets of
          the data for specific use cases.
        </p>

        <h2>How can I help?</h2>
        <p>
          If you want to help map out political positions and their office
          holders, please consider using one of the following paths:
        </p>
        <ul className="spaced">
          <li>
            <strong>Want to add or enrich individual PEP profiles?</strong>{' '}
            Contribute to Wikidata&apos;s{' '}
            <Link href="https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician">
              WikiProject Every Politician
            </Link>
            . This is a community-driven effort to maintain a database of
            political positions. Like all Wikipedia projects, it has community
            review and verification standards. Start by getting a sense of
            Wikidata&apos;s{' '}
            <Link href="https://www.wikidata.org/wiki/Wikidata:WikiProject_every_politician/Political_data_model">
              political data model
            </Link>
            , and allow for a delay of several days for Wikidata edits to be
            reflected in OpenSanctions.
          </li>
          <li>
            <strong>Want to add a bulk data crawler?</strong> Our crawlers are{' '}
            <Link href="https://github.com/opensanctions/opensanctions/tree/main/datasets">
              open source code
            </Link>
            , using the zavod data collection framework (Python). Check out the{' '}
            <Link href="/docs/criteria">data inclusion criteria</Link>, and the{' '}
            <Link href="https://zavod.opensanctions.org/tutorial/">
              crawler writing tutorial
            </Link>
            . Our{' '}
            <Link href="https://bit.ly/osa-sources">data source wishlist</Link>{' '}
            is a good source of inspiration.
          </li>
          <li>
            <strong>Want to partner up?</strong> Please feel free to{' '}
            <Link href="/contact/">reach out to us</Link> to discuss other ideas
            for collaboration. As we are cleaning up and enhancing the position
            listings above using bulk data processing techniques, individual
            corrections sent via email will be of somewhat limited benefit.
          </li>
        </ul>
      </Container>
    </LayoutFrame>
  );
}
