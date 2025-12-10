import classNames from 'classnames';
import Link from 'next/link';

import { IPage } from '@/lib/pages';


import { DocsMenu, MenuProps } from './Menu';
import { HtmlContent } from './util';
import { Button, Col, Container, Row } from './wrapped';

import styles from '@/styles/Content.module.scss';



type ContentProps = {
  content: IPage
}

type ContentFrameProps = {
  content: IPage
  children?: React.ReactNode
}

function ContentBody({ content }: ContentProps) {
  return <HtmlContent html={content.body} className={styles.markdown} />;
}

type ContentMenuProps = {
  path: string
  Menu: React.ComponentType<MenuProps>
}

function ContentMenu({ path, children, Menu }: React.PropsWithChildren<ContentMenuProps>) {
  return (
    <Container>
      <Row>
        <Col md={9} className='order-1 order-md-2'>
          {children}
        </Col>
        <Col md={3} className={classNames(styles.menuBar, "order-2 order-md-1")}>
          <Menu path={path} />
        </Col>
      </Row>
    </Container>
  )
}

function ContentFooter() {
  return (
    <div className={classNames(styles.footer, "d-print-none")}>
      <Button href="/support/" className={styles.footerAction}>Got questions?</Button> Our support is here to help.
      You can also join the <Link href="https://discuss.opensanctions.org">discussion forum</Link> to meet the community.
    </div>
  )
}

function ContentContext({ content, children }: ContentFrameProps) {
  return (
    <ContentMenu path={content.menu_path} Menu={DocsMenu}>
      <div className={styles.page}>
        {children}
        <ContentFooter />
      </div >
    </ContentMenu >
  )
}

function ContentPage({ content }: ContentProps) {
  return (
    <ContentContext content={content}>
      <ContentBody content={content} />
    </ContentContext>
  );
}

export default class Content {
  static Body = ContentBody;
  static Page = ContentPage;
  static Menu = ContentMenu;
  static Footer = ContentFooter;
  static Context = ContentContext;
}