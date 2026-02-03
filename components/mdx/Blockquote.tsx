import { ReactNode } from 'react';

interface BlockquoteProps {
  children: ReactNode;
  cite?: string;
}

export default function Blockquote({ children, cite }: BlockquoteProps) {
  return (
    <blockquote className="blockquote border-start border-4 ps-3 my-4">
      <p className="mb-0">{children}</p>
      {cite && <footer className="blockquote-footer mt-2">{cite}</footer>}
    </blockquote>
  );
}
