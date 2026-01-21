import fs from 'fs';
import matter from 'gray-matter';
import { Metadata } from 'next';
import path from 'path';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import { BASE_URL } from './constants';

async function markdownToHtml(
  markdown: string | undefined | null,
): Promise<string> {
  if (markdown === null || markdown === undefined) {
    return '';
  }
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);
  return result.value as string;
}

export type PageMetadata = {
  path: string;
  title: string;
  image?: string;
  summary: string | null;
  menu_path: string;
  no_index: boolean;
  date_created: string;
  date_updated: string;
};

export type Page = PageMetadata & {
  url: string;
  body: string;
  summaryHtml: string | null;
};

type DocsFile = {
  filePath: string;
  meta: PageMetadata;
  body: string;
};

async function getDocsFiles(): Promise<DocsFile[]> {
  const docsDir = path.join(process.cwd(), 'docs');
  const files: DocsFile[] = [];

  const processDirectory = async (dir: string): Promise<void> => {
    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isFile() && entry.name.endsWith('.md')) {
          try {
            const content = await fs.promises.readFile(fullPath, 'utf8');
            const stats = await fs.promises.stat(fullPath);
            const { data, content: body } = matter(content);
            const frontmatter = data as any;

            // Determine the final path
            let finalPath = frontmatter.path;
            if (!finalPath) {
              const relativePath = path.relative(docsDir, fullPath);
              finalPath =
                '/' + relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
            }

            // Create complete metadata with defaults
            const meta: PageMetadata = {
              path: finalPath,
              title: frontmatter.title || 'Untitled',
              image: frontmatter.image,
              summary: frontmatter.summary || null,
              menu_path: finalPath,
              no_index: frontmatter.no_index || false,
              date_created:
                frontmatter.date_created || stats.birthtime.toISOString(),
              date_updated:
                frontmatter.date_updated || stats.mtime.toISOString(),
            };

            files.push({
              filePath: fullPath,
              meta,
              body,
            });
          } catch (error) {
            console.error('Error processing doc file:', fullPath, error);
          }
        } else if (entry.isDirectory()) {
          await processDirectory(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
  };

  await processDirectory(docsDir);
  return files;
}

export async function getPageByPath(
  requestedPath: string,
): Promise<Page | null> {
  const docsFiles = await getDocsFiles();
  const docsFile = docsFiles.find((file) => file.meta.path === requestedPath);

  if (!docsFile) {
    return null;
  }

  return {
    ...docsFile.meta,
    url: `${BASE_URL}${docsFile.meta.path}`,
    body: await markdownToHtml(docsFile.body),
    summaryHtml: docsFile.meta.summary
      ? await markdownToHtml(docsFile.meta.summary)
      : null,
  };
}

function getPageMetadata(page: Page | null): Metadata {
  if (page === null) {
    return {};
  }
  return {
    title: page.title,
    description: page.summary || undefined,
    alternates: { canonical: page.url },
    robots: page.no_index ? { index: false } : undefined,
    openGraph: page.image ? { images: [page.image] } : undefined,
  };
}

export async function getPathMetadata(path: string): Promise<Metadata> {
  const page = await getPageByPath(path);
  if (page === null) {
    return {};
  }
  return getPageMetadata(page);
}

export async function getSitemapPages(
  limit: number = 5000,
): Promise<Array<PageMetadata>> {
  const docsFiles = await getDocsFiles();
  const pages = docsFiles
    .filter((file) => !file.meta.no_index)
    .map((file) => file.meta);

  // Sort by date_created
  pages.sort(
    (a, b) =>
      new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
  );
  return pages.slice(0, limit);
}
