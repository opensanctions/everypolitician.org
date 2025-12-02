//
// https://developers.google.com/search/docs/advanced/structured-data/dataset
// https://schema.org/Dataset

import { BASE_URL, LICENSE_URL, CLAIM, EMAIL, SITE } from './constants';
import { Entity } from './ftm';
import { IDataset, IResource, isExternal, IDatasetPublisher, isSource } from './types';


export function getSchemaOpenSanctionsOrganization() {
  return {
    "@context": "https://schema.org/",
    "@type": "Organization",
    "name": "OpenSanctions Datenbanken GmbH",
    "url": `${BASE_URL}/docs/about`,
    "email": EMAIL,
    "description": CLAIM
  }
}

export function getSchemaActions() {
  return {
    "@context": "https://schema.org/",
    "@type": "SearchAction",
    "target": {
      "@context": "https://schema.org/",
      "@type": "EntryPoint",
      "urlTemplate": `${BASE_URL}/search/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string"
  }
}

export function getSchemaWebSite() {
  return {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": SITE,
    "url": BASE_URL,
    "description": CLAIM,
    "license": LICENSE_URL,
    "mainEntityOfPage": getDataCatalog(),
    "creator": getSchemaOpenSanctionsOrganization(),
    "potentialAction": getSchemaActions(),
  }
}

export function getDataCatalog() {
  return {
    "@context": "https://schema.org/",
    "@type": "DataCatalog",
    "name": SITE,
    "url": `${BASE_URL}/datasets/`,
    "creator": getSchemaOpenSanctionsOrganization(),
    license: LICENSE_URL,
  }
}

function getPublisherOrganization(publisher: IDatasetPublisher) {
  return {
    "@context": "https://schema.org/",
    "@type": "Organization",
    "name": publisher.name,
    "url": publisher.url,
    "description": publisher.description,
  }
}

function getResourceDataDownload(resource: IResource) {
  return {
    "@context": "https://schema.org/",
    "@type": "DataDownload",
    "name": resource.title,
    "contentUrl": resource.url,
    "encodingFormat": resource.mime_type,
    "uploadDate": resource.timestamp,
  }
}

export function getSchemaDataset(dataset: IDataset) {
  if (isExternal(dataset)) {
    return undefined;
  }
  let schema: any = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    "name": dataset.title,
    "url": `${BASE_URL}/datasets/${dataset.name}/`,
    "description": dataset.summary,
    "license": LICENSE_URL,
    "includedInDataCatalog": getDataCatalog(),
    "creator": getSchemaOpenSanctionsOrganization(),
    "isAccessibleForFree": true,
    "dateModified": dataset.last_change,
    "potentialAction": getSchemaActions(),
    "distribution": dataset.resources.map((r) => getResourceDataDownload(r))
  }
  if (!!dataset.publisher) {
    schema = {
      ...schema,
      "creator": getPublisherOrganization(dataset.publisher),
      "maintainer": getSchemaOpenSanctionsOrganization(),
    }
    if (dataset.url) {
      schema = {
        ...schema,
        "isBasedOn": dataset.url,
      }
    }
    if (dataset.publisher.country !== 'zz') {
      schema = {
        ...schema,
        "countryOfOrigin": dataset.publisher.country,
      }
    }
  }
  return schema;
}

export function getSchemaEntityPage(entity: Entity, datasets: Array<IDataset>) {
  const schemaDatasets = datasets.map(d => getSchemaDataset(d)).filter(d => !!d)
  return {
    "@context": "https://schema.org/",
    "@type": "WebPage",
    "name": entity.caption,
    "maintainer": getSchemaOpenSanctionsOrganization(),
    "isPartOf": schemaDatasets.map(d => d.url),
    "license": LICENSE_URL,
    "dateCreated": entity.first_seen,
    "dateModified": entity.getFirst('modifiedAt') || entity.last_seen,
  }
}
