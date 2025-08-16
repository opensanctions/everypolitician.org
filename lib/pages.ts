import { BASE_URL } from './constants';
import { markdownToHtml } from './util';
import { getGenerateMetadata } from './meta';
import { Metadata } from 'next';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';


export interface IPageMetadata {
  path: string
  title: string
  image?: string
  summary: string | null
  section: string
  menu_path: string
  no_index: boolean
  date_created: string
  date_updated: string
}

export interface IPage extends IPageMetadata {
  url: string
  body: string
}

interface IDocsFile {
  filePath: string;
  meta: IPageMetadata;
  body: string;
}

async function getDocsFiles(): Promise<IDocsFile[]> {
  const docsDir = path.join(process.cwd(), 'docs');
  const files: IDocsFile[] = [];
  
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
              finalPath = '/' + relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
            }
            
            // Create complete metadata with defaults
            const meta: IPageMetadata = {
              path: finalPath,
              title: frontmatter.title || 'Untitled',
              image: frontmatter.image,
              summary: frontmatter.summary || null,
              section: frontmatter.section || 'docs',
              menu_path: finalPath,
              no_index: frontmatter.no_index || false,
              date_created: frontmatter.date_created || stats.birthtime.toISOString(),
              date_updated: frontmatter.date_updated || stats.mtime.toISOString()
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

export async function getPageByPath(requestedPath: string): Promise<IPage | null> {
  const docsFiles = await getDocsFiles();
  const docsFile = docsFiles.find(file => file.meta.path === requestedPath);
  
  if (!docsFile) {
    return null;
  }

  return {
    ...docsFile.meta,
    url: `${BASE_URL}${docsFile.meta.path}`,
    body: await markdownToHtml(docsFile.body),
  };
}


export function getPageMetadata(page: IPage | null): Metadata {
  if (page === null) {
    return {}
  }
  return getGenerateMetadata({
    title: page.title,
    noIndex: page.no_index,
    description: page.summary || undefined,
    canonicalUrl: page.url,
    imageUrl: page.image || null
  })
}

export async function getSitemapPages(limit: number = 5000): Promise<Array<IPageMetadata>> {
  const docsFiles = await getDocsFiles();
  const pages = docsFiles
    .filter(file => !file.meta.no_index)
    .map(file => file.meta);
  
  // Sort by date_created
  pages.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
  return pages.slice(0, limit);
}
