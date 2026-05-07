import Link from 'next/link';

import LayoutFrame from '@/components/layout/LayoutFrame';
import Section from '@/components/layout/Section';

export default function NotFound() {
  return (
    <LayoutFrame>
      <Section>
        <h1 className="text-center">Page not found</h1>
        <p className="text-center text-muted">
          The page you have requested cannot be found. Try visiting the{' '}
          <Link href="/">home page</Link> to explore the site.
        </p>
      </Section>
    </LayoutFrame>
  );
}
