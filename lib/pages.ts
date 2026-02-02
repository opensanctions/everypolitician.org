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
  menu_order?: number;
  menu_hidden?: boolean;
  menu_title?: string;
};

export type MenuItem = {
  path: string;
  title: string;
  order: number;
  children: MenuItem[];
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
              menu_order: frontmatter.menu_order,
              menu_hidden: frontmatter.menu_hidden || false,
              menu_title: frontmatter.menu_title,
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

export async function getDocsMenu(): Promise<MenuItem[]> {
  const docsFiles = await getDocsFiles();

  // Filter out hidden pages and build a map of path -> metadata
  const pageMap = new Map<string, PageMetadata>();
  for (const file of docsFiles) {
    if (!file.meta.menu_hidden) {
      pageMap.set(file.meta.path, file.meta);
    }
  }

  // Build tree structure from flat list
  const rootItems: MenuItem[] = [];
  const itemMap = new Map<string, MenuItem>();

  // Sort pages by path depth (parents before children)
  const sortedPaths = Array.from(pageMap.keys()).sort(
    (a, b) => a.split('/').length - b.split('/').length,
  );

  for (const pagePath of sortedPaths) {
    const meta = pageMap.get(pagePath)!;
    const item: MenuItem = {
      path: meta.path,
      title: meta.menu_title || meta.title,
      order: meta.menu_order ?? 100,
      children: [],
    };
    itemMap.set(pagePath, item);

    // Find parent path by going up one level
    // e.g., /about/contribute/wikidata/ -> /about/contribute/
    const segments = pagePath.split('/').filter(Boolean);
    if (segments.length <= 2) {
      // Top-level item (e.g., /about/ or /about/contribute/)
      rootItems.push(item);
    } else {
      // Try to find parent
      const parentPath = '/' + segments.slice(0, -1).join('/') + '/';
      const parent = itemMap.get(parentPath);
      if (parent) {
        parent.children.push(item);
      } else {
        // No parent found, add to root
        rootItems.push(item);
      }
    }
  }

  // Sort items recursively by order, then by title
  const sortItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .map((item) => ({
        ...item,
        children: sortItems(item.children),
      }))
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.title.localeCompare(b.title);
      });
  };

  return sortItems(rootItems);
}
