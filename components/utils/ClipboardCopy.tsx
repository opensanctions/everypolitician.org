'use client';

import { ClipboardPlusFill } from "react-bootstrap-icons";

type ClipboardCopyProps = {
  text: string
}

export function ClipboardCopy({ text }: ClipboardCopyProps) {
  return <span className="clipboard-copy" onClick={() => { navigator.clipboard.writeText(text) }}>
    <ClipboardPlusFill />
  </span>;
}
