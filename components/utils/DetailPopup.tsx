'use client';

import Modal from 'react-bootstrap/Modal';
import { MouseEvent, ReactNode, useState } from "react";
import { ArrowUpRightCircleFill } from 'react-bootstrap-icons';

type DetailPopupProps = {
  title: string
  children: ReactNode
}


export function DetailPopup({ title, children }: DetailPopupProps) {
  const [visible, setVisible] = useState(false);

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    setVisible(true);
  }
  return (
    <>
      <a href="#" onClick={onClick}>
        <ArrowUpRightCircleFill />
      </a>
      <Modal
        show={visible}
        size="lg"
        onHide={() => setVisible(false)}
        // backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
      </Modal>
    </>
  );
}
