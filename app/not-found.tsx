import Link from 'next/link';

import LayoutFrame from '@/components/layout/LayoutFrame'
import { Container } from '@/components/wrapped';

import styles from '@/styles/Error.module.scss'

export default function NotFound() {
  return (
    <LayoutFrame>
      <Container>
        <h1 className={styles.errorTitle}>
          Page not found
        </h1>
        <p className={styles.errorSummary}>
          The page you have requested cannot be found. Try visiting
          the <Link href="/">home page</Link> to explore the site.
        </p>
      </Container>
    </LayoutFrame>
  )
}