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

## See also

- https://www.opensanctions.org/docs/pep/methodology/
- https://www.opensanctions.org/pep/
- https://www.opensanctions.org/datasets/peps/
