import { Model } from "./ftm";
import { IModelSpec } from "./types";

import modelJson from '../data/model.json';


const index = modelJson as any as IModelSpec;
const ftmModel = new Model(index.model);


export async function getModelSpec(): Promise<IModelSpec> {
    return index;
}

export async function getModel(): Promise<Model> {
    return ftmModel;
}

export async function getCountries(): Promise<Map<string, string>> {
    // const model = await getModel();
    return ftmModel.getType('country').values;
}

export function getTargetTopics(): string[] {
    return index.target_topics;
}
