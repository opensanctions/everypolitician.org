import { Children, ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import slugify from 'slugify';

import { Alert, Figure } from '@/components/mdx';

function createHeading(Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  return function Heading({ children }: { children: ReactNode }) {
    const text = Children.toArray(children)
      .map((child) => (typeof child === 'string' ? child : ''))
      .join('');
    const id = slugify(text, { lower: true, strict: true });
    return <Tag id={id}>{children}</Tag>;
  };
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: createHeading('h1'),
    h2: createHeading('h2'),
    h3: createHeading('h3'),
    h4: createHeading('h4'),
    h5: createHeading('h5'),
    h6: createHeading('h6'),
    Alert,
    Figure,
    ...components,
  };
}
