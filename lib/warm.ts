import { EXTRA_COLLECTIONS, FEATURED_COLLECTIONS } from "./constants";
import { getDatasetsByScope } from "./data";
import { getPageByPath, getSitemapPages } from "./pages";
import { getTerritories } from "./territory";


export async function warmUpCache() {
    await getTerritories();

    const collections = [...FEATURED_COLLECTIONS, ...EXTRA_COLLECTIONS];
    for (const scope of collections) {
        console.log(`Warming up scope cache for: ${scope}...`);
        await getDatasetsByScope(scope);
    }

    const pages = await getSitemapPages();
    for (const p of pages) {
        console.log(`Warming up page cache for: ${p.path}...`);
        await getPageByPath(p.path);
    }
}