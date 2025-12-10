import modelJson from '../data/model.json';

import { Model } from "./ftm";
import { IModelSpec } from "./types";



const index = modelJson as any as IModelSpec;
const ftmModel = new Model(index.model);


export async function getModel(): Promise<Model> {
    return ftmModel;
}

export function getTargetTopics(): string[] {
    return index.target_topics;
}
