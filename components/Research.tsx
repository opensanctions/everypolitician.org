import classNames from 'classnames';
import { ensureArray } from '@/lib/util';
import { Container, FormControl, InputGroup, Button } from './wrapped';
import { ServerSearchParams } from './utils/PageProps';

import styles from '@/styles/Research.module.scss';


type ResearchProps = {
  title?: string
  query?: ServerSearchParams
  isLoading?: boolean
  hidePrint?: boolean
}

function ResearchContext({ title, query, children, isLoading, hidePrint }: React.PropsWithChildren<ResearchProps>) {
  const activeTitle = !!title ? title : 'Search OpenSanctions';
  const activeQuery = query ? query : {};
  const queryText = activeQuery['q'] || '';
  const otherQuery = { ...activeQuery };
  delete otherQuery['q'];
  delete otherQuery['offset'];
  return (
    <>
      <div className={classNames(styles.researchBar, { "d-print-none": !!hidePrint })}>
        <Container>
          <h2>{activeTitle}</h2>
          <form className="d-flex" action="/search/">
            <InputGroup>
              <FormControl
                type="search"
                name="q"
                defaultValue={queryText}
                placeholder="Search people, companies and other entities of interest..."
                className={styles.navSearchBox}
                disabled={isLoading}
                aria-label="Search"
              />
              <Button variant="light" className="d-print-none" href="/advancedsearch" disabled={isLoading}>Advanced</Button>
              <Button variant="secondary" className="d-print-none" type="submit" disabled={isLoading}>Search</Button>
              {Object.entries(otherQuery).map(([field, values]) => ensureArray(values).map(value =>
                <input key={field + ':' + value} type="hidden" name={field + ''} value={value} />
              ))}
            </InputGroup>
          </form>
        </Container>
      </div >
      {children}
    </>
  )
}



export default class Research {
  static Context = ResearchContext;
}
