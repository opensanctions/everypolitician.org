import { fetchCms, ItemsResponse } from './cms';

export interface ITerritoryInfo {
    label_short: string
    label_full: string
    code: string
    flag?: string
    region?: string
    subregion?: string
    summary?: string
    wikipedia_url?: string
    in_sentence: string
    dissolved: boolean
    date_updated: string
    date_created: string
    see: string[]
}


function adaptItem(item: any): ITerritoryInfo {
    const see = item.see || [];
    return {
        label_short: item.label_short,
        label_full: item.label_full,
        code: item.code,
        flag: item.flag,
        region: item.region || undefined,
        subregion: item.subregion || undefined,
        summary: item.summary,
        wikipedia_url: item.wikipedia_url,
        date_updated: item.date_updated || item.date_created,
        date_created: item.date_created,
        in_sentence: item.in_sentence || item.label_short,
        dissolved: item.dissolved,
        see: see.map((r: { related_territories_code: any; }) => r.related_territories_code),
    };
}


export async function getTerritories(): Promise<Array<ITerritoryInfo>> {
    const query = {
        'fields': ['*', 'see.*'],
        'limit': 1000,
    }
    const respData = await fetchCms<ItemsResponse>('/items/territories', query);
    const results = respData.data;
    return results.map(adaptItem);
}


export async function getTerritoryInfo(code: string): Promise<ITerritoryInfo | null> {
    // Always fetch all because the country page reads the list, too:
    const territories = await getTerritories();
    return territories.find((t) => t.code === code) || null;
}


export async function getTerritoriesByCode(): Promise<Map<string, ITerritoryInfo>> {
    const territories = await getTerritories();
    return new Map(territories.map((t) => [t.code, t]));
}
