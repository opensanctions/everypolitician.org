import { Entity } from "./ftm";
import { getTargetTopics } from "./model";


export function getEntityRiskTopics(entity: Entity, linked: boolean = false): string[] {
    const prop = entity.schema.getProperty("topics");
    if (prop === undefined) {
        return [];
    }
    const targetTopics = getTargetTopics();
    const riskyTopics = new Set(targetTopics);
    if (!linked) {
        riskyTopics.delete('sanction.linked');
    }
    const topics = entity.getProperty(prop)
        .filter((t) => typeof t === 'string' && riskyTopics.has(t));
    const topicsSet = new Set(topics as string[]);
    if (topicsSet.has('sanction') || topicsSet.has('role.pep')) {
        topicsSet.delete('poi');
        topicsSet.delete('role.rca');
        topicsSet.delete('role.oligarch');
    }
    return Array.from(topicsSet);
}