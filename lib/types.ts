import { Entity, IEntityDatum, IModelDatum, Property } from "./ftm";
import { ITerritoryInfo } from "./territory";

export interface IResource {
  url: string
  timestamp: string
  mime_type: string
  title: string
}

export interface IDatasetPublisher {
  url?: string
  name: string
  acronym?: string
  description?: string
  official: boolean
  country?: string
  country_label?: string
  territory?: ITerritoryInfo
}

export interface IDatasetCoverage {
  start?: string
  frequency?: string
}

export interface IDataset {
  name: string
  type: string
  title: string
  link: string
  url?: string
  summary: string
  hidden: boolean
  last_change?: string
  last_export?: string
  thing_count?: number
  datasets?: Array<string>
  resources?: Array<IResource>
  coverage?: IDatasetCoverage
  publisher?: IDatasetPublisher
}

export function isCollection(dataset?: IDataset): dataset is IDataset & { datasets: Array<string> } {
  return dataset?.type === 'collection';
}

export function isSource(dataset?: IDataset): boolean {
  return dataset?.type === 'source';
}

export function isExternal(dataset?: IDataset): boolean {
  return dataset?.type === 'external';
}

export interface IModelSpec {
  app: string
  version: string
  model: IModelDatum
  target_topics: string[]
}

interface ISearchFacetItem {
  name: string
  label: string
  count: number
}

export interface ISearchFacet {
  label: string
  values: Array<ISearchFacetItem>
}

interface IResponseTotal {
  value: number
  relation: string
}

export interface IPaginatedResponse {
  total: IResponseTotal
  limit: number
  offset: number
}

export interface ISearchAPIResponse extends IPaginatedResponse {
  results: Array<IEntityDatum>
  facets: { [prop: string]: ISearchFacet }
}

export interface IDictionary<T> {
  [key: string]: T
}

export interface IPropResultsData extends IPaginatedResponse {
  results: Array<IEntityDatum>
}

export interface IPropResults extends IPaginatedResponse {
  results: Array<Entity>
}

export interface IPropsResultsData {
  entity: IEntityDatum
  adjacent: { [prop: string]: IPropResultsData }
}

export interface IPropsResults {
  entity: Entity,
  adjacent: Map<Property, IPropResults>
}
