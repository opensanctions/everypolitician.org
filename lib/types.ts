import { Entity, IEntityDatum, IModelDatum, Property } from "./ftm";
import { ITerritoryInfo } from "./territory";

export interface IVersionsIndex {
  items: Array<string>
}

export interface IResource {
  url: string
  name: string
  sha1: string
  timestamp: string
  dataset: string
  mime_type: string
  mime_type_label: string
  size: number
  title: string
}

export interface IIssueType {
  warning: number
  error: number
}

export interface IDatasetPublisher {
  url?: string
  name: string
  name_en?: string
  acronym?: string
  description: string
  official: boolean
  country?: string
  country_label?: string
  territory?: ITerritoryInfo
  logo_url?: string
}

export interface IDatasetCoverage {
  start: string
  end: string
  countries: string[]
  frequency?: string
  schedule?: string
}

export interface INKDatasetBase {
  name: string
  type: string
  title: string
  link: string
  url?: string
  tags?: string[]
  version: string
  updated_at: string
  summary: string
  description?: string
  datasets?: Array<string>
  resources: Array<IResource>
  coverage?: IDatasetCoverage
  publisher?: IDatasetPublisher
}


export interface IDatasetBase extends INKDatasetBase {
  hidden: boolean
  full_dataset?: string
  index_url: string
  last_change?: string
  last_export: string
  issue_count: number
  issue_levels: IIssueType
  issues_url: string
  statistics_url?: string
  target_count?: number
  entity_count?: number
  thing_count?: number
}

export interface ISourceData {
  format?: string
  model?: string
  url?: string
}

export interface ISource extends IDatasetBase {
  data: ISourceData
}

export interface IExternal extends IDatasetBase {
  data?: ISourceData
}

export interface ICollection extends IDatasetBase {
  datasets: Array<string>
}

export type IDataset = ISource | IExternal | ICollection

export interface INKDataCatalog {
  datasets: Array<IDataset>
}

export interface ICatalogEntry {
  name: string
  title: string
  type?: string
  hidden?: boolean
}

export function isCollection(dataset?: IDataset | ICatalogEntry): dataset is ICollection {
  return dataset?.type === 'collection';
}

export function isSource(dataset?: IDataset | ICatalogEntry): dataset is ISource {
  return dataset?.type === 'source';
}

export function isExternal(dataset?: IDataset | ICatalogEntry): dataset is IExternal {
  return dataset?.type === 'external';
}

export function isDataset(dataset: IDataset | ICatalogEntry | undefined): dataset is IDataset {
  return isCollection(dataset) || isSource(dataset) || isExternal(dataset);
}

export const LEVEL_ERROR = 'error'
export const LEVEL_WARNING = 'warning'

export interface IIssue {
  id: number
  level: string
  message: string
  module: string
  timestamp: string
  data: { [key: string]: string }
  dataset: string
  entity_id?: string | null
  entity_schema?: string | null
}

export interface IIssueIndex {
  issues: Array<IIssue>
}

export interface IModelSpec {
  app: string
  version: string
  model: IModelDatum
  target_topics: string[]
}

export interface ICatalog {
  datasets: Array<ICatalogEntry>
}

export interface ISearchFacetItem {
  name: string
  label: string
  count: number
}

export interface ISearchFacet {
  label: string
  values: Array<ISearchFacetItem>
}

export interface IResponseTotal {
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

export interface IFtResult {
  detail: string
  score: number
}

export interface IMatchedEntityDatum extends IEntityDatum {
  explanations: { [key: string]: IFtResult }
  score: number
  match: boolean
}

export interface IMatchAPIResponse {
  results: Array<IMatchedEntityDatum>
  total: IResponseTotal
}

export interface IMatchQuery {
  schema: string
  properties: { [prop: string]: string[] }
}

export interface ISitemapEntity {
  id: string
  lastmod: string
}

export interface IRecentEntity {
  id: string
  caption: string
  first_seen: string
  schema: string
  countries: string[]
}

export interface IDictionary<T> {
  [key: string]: T
}

export interface ITaggingPosition {
  entity_id: string
  caption: string
  countries: Array<string>
  topics: Array<string>
  dataset: string
  is_pep: boolean
  created_at: string
}

export interface ITaggingSearchResponse extends IPaginatedResponse {
  results: Array<ITaggingPosition>
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
