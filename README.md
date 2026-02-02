# everypolitician.org

We're building up the next generation of EveryPolitician.org as a front-end for OpenSanctions' PEP
data, primarily sourced from Wikidata and a set of other public sources.

## Development

```bash
npm install
npm run dev
```

### Redis cache (optional)

To test Redis caching locally (requires production mode):

```bash
docker-compose up -d
echo "REDIS_URL=redis://localhost:6379" >> .env.local
npm run build && npm run start
```

## Documentation pages

Documentation pages use MDX (Markdown with JSX) and live in `app/about/`. The URL is determined by the file path:

- `app/about/page.mdx` → `/about/`
- `app/about/contribute/page.mdx` → `/about/contribute/`
- `app/about/contribute/wikidata/page.mdx` → `/about/contribute/wikidata/`

### Page metadata

Each MDX file exports metadata at the top:

```mdx
export const metadata = {
  title: 'Page Title',
  description: 'Brief description for SEO',
  robots: { index: false }, // optional: exclude from search engines
};

# Page Title

Content goes here...
```

### Custom components

Two components are available for use in MDX:

```mdx
<Alert type="info">
  This is an info callout. Types: `info`, `warning`, `secondary`.
</Alert>

<Figure
  src="/images/docs/example.png"
  alt="Description of image"
  caption="Optional caption text"
/>
```

### Heading anchors

Headings automatically get IDs for anchor links based on their text:

```mdx
## Getting Started

Link to it with [jump to section](#getting-started)
```

### Sidebar menu

The sidebar menu is static and defined in `components/docs/AboutSidebar.tsx`. Update it when adding new pages.

## See also

- https://www.opensanctions.org/docs/pep/methodology/
- https://www.opensanctions.org/pep/
- https://www.opensanctions.org/datasets/peps/
