import { getTerritories } from "./territory";
import { getDatasetsByScope } from "./data";
import { MAIN_DATASET } from "./constants";
import { getPageByPath, getSitemapPages } from "./pages";


export async function warmUpCache() {
    await getTerritories();
    await getDatasetsByScope(MAIN_DATASET)

    const pages = await getSitemapPages();
    for (const p of pages) {
        console.log(`Warming up page cache for: ${p.path}...`);
        await getPageByPath(p.path);
    }
}