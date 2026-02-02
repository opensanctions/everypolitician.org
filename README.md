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

Documentation lives in the `docs/` directory as Markdown files. Pages are served under `/about/` and the sidebar menu is generated automatically.

### Front-matter options

Each Markdown file should have YAML front-matter:

```yaml
---
title: Page Title # Required: page title and default menu label
summary: Brief description # Optional: used for meta description
path: /about/example/ # Required: URL path (must end with /)
menu_order: 1 # Optional: menu sort order (lower = higher)
menu_title: Short Title # Optional: custom menu label (defaults to title)
menu_hidden: true # Optional: hide from menu
no_index: false # Optional: exclude from search engines
date_created: 2025-01-01 # Optional: for sitemap
---
```

### Creating submenus

Submenus are created automatically based on the path hierarchy. For example:

- `docs/contribute.md` with `path: /about/contribute/` appears at the top level
- `docs/wikidata.md` with `path: /about/contribute/wikidata/` appears nested under Contribute

The submenu expands when the parent or any child page is active.

## See also

- https://www.opensanctions.org/docs/pep/methodology/
- https://www.opensanctions.org/pep/
- https://www.opensanctions.org/datasets/peps/
