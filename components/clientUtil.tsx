"use client"

import classNames from "classnames"
import { ReactNode } from "react"
import { Placement } from "react-bootstrap/esm/types"
import { QuestionCircleFill } from "react-bootstrap-icons"

import { OverlayTrigger, Tooltip } from "./wrapped"

import styles from "@/styles/util.module.scss"


type HelpLinkProps = {
  href: string
  size?: number
  children?: ReactNode
  tooltipId?: string
  placement?: Placement
}

export function HelpLink({ href, size = 10, children, tooltipId, placement = 'top' }: HelpLinkProps) {
  const link = (
    <a href={href} className={classNames("d-print-none", styles.helpLink)}>
      <sup><QuestionCircleFill size={size} /></sup>
    </a>
  );
  return (
    !!tooltipId
      ? <OverlayTrigger placement={placement} overlay={<Tooltip id={tooltipId} >{children}</Tooltip>} >
        <span>{link}</span>
      </OverlayTrigger>
      : link
  )
}



type ExplainProps = {
  tooltip: string
  placement?: string
}

export function Explain({ children, tooltip, placement = 'right' }: React.PropsWithChildren<ExplainProps>) {
  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 10, hide: 50 }}
      overlay={
        <Tooltip id="explain-tooltip">
          <div className={styles.explainContent}>{tooltip}</div>
        </Tooltip>
      }
    >
      <span className={styles.explainAnchor}>{children}</span>
    </OverlayTrigger>
  )
}

