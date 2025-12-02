import classNames from 'classnames';
import Link from 'next/link';

import { IPage } from '@/lib/pages';


import { AboutMenu, DocumentationMenu, MenuProps } from './Menu';
import { JSONLink, Markdown, Summary } from './util';
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
  return <Markdown markdown={content.body} className={styles.markdown} />;
}

type ContentMenuProps = {
  title: string
  path: string
  summary?: string | null
  jsonLink?: string
  Menu: React.ComponentType<MenuProps>
}

function ContentMenu({ title, summary, path, children, jsonLink, Menu }: React.PropsWithChildren<ContentMenuProps>) {
  return (
    <Container>
      <Row>
        <Col md={9} className='order-1 order-md-2'>
          <h1>
            {title}
            {jsonLink && (<JSONLink href={jsonLink} />)}
          </h1>
          {!!summary && (
            <Summary summary={summary} />
          )}
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
  const MenuComponent = content.section === "about" ? AboutMenu : DocumentationMenu;
  return (
    <ContentMenu title={content.title} summary={content.summary} path={content.menu_path} Menu={MenuComponent}>
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