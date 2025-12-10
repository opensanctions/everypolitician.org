import cronstrue from 'cronstrue';
import castArray from 'lodash/castArray';
import React, { ReactElement } from 'react'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkHeadingId from 'remark-heading-id'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

export async function markdownToHtml(markdown: string | undefined | null, fragment: string = ''): Promise<string> {
  if (markdown === null || markdown === undefined) {
    return '';
  }
  const result = await unified()
    .use(remarkHeadingId, { defaults: true })
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown)
  return result.value as string;
}


/*
 * https://stackoverflow.com/questions/23618744/rendering-comma-separated-list-of-links
 */
export function wordList(arr: Array<any>, sep: string | ReactElement): ReactElement {
  if (arr.length === 0) {
    return <></>;
  }

  return arr.slice(1)
    .reduce((xs, x, i) => xs.concat([
      <span key={`${i}_sep`} className="separator">{sep}</span>,
      <span key={i}>{x}</span>
    ]), [<span key={arr[0]}>{arr[0]}</span>])
}

export function ensureArray(value: string | string[] | null | undefined) {
  if (value === null || value === undefined) {
    return [];
  }
  return castArray(value);
}

export function arrayFirst(value: string | string[] | null | undefined): string | undefined {
  const arr = ensureArray(value);
  if (arr.length > 0) {
    return arr[0];
  }
  return undefined;
}

export const cronText = (schedule: string): string => {
  try {
    let text = cronstrue.toString(schedule, { verbose: false, use24HourTimeFormat: true });
    text = text.replace('At 0 minutes past the hour,', '');
    return text;
  } catch {
    console.error('Invalid cron schedule:', schedule)
    return schedule;
  }
}

export function randomizeCache(number: number): number {
  // return number;
  const upForGrabs = number * 0.3;
  const minimum = number - upForGrabs;
  return Math.floor(minimum + (Math.random() * upForGrabs));
}
