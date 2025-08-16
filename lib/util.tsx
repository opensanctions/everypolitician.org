import React, { ReactElement } from 'react'
import castArray from 'lodash/castArray';
import cronstrue from 'cronstrue';
import { unified } from 'unified'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkHeadingId from 'remark-heading-id'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'

export async function markdownToHtml(markdown: string): Promise<string> {
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

export function asString(value: any): string | undefined {
  if (!Array.isArray(value)) {
    value = [value];
  }
  for (let item of value) {
    if (item !== null && item !== undefined) {
      item = item + ''
      item = item.trim()
      if (item.length > 0) {
        return item;
      }
    }
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
