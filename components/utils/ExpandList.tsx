'use client';

import { ReactNode, useState } from "react";

import { SPACER } from "@/lib/constants";

import styles from '@/styles/util.module.scss';

type ExpandListProps = {
  short: ReactNode
  moreText: ReactNode
  full: ReactNode
}


export function ExpandList({ short, full, moreText }: ExpandListProps) {
  const [expanded, setExpanded] = useState(false);
  if (!expanded) {
    return (
      <>
        {short}
        {SPACER}
        <span className={styles.expandLink} onClick={(e) => { e.preventDefault(); setExpanded(true) }}>{moreText}</span>
      </>
    );
  }
  return <>{full}</>;
}
