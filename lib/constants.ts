
export const SITE = "EveryPolitician"
export const BASE_URL = "https://www.everypolitician.org"
export const INDEX_URL = "https://data.opensanctions.org/datasets/latest/index.json"
export const MODEL_URL = "https://data.opensanctions.org/meta/model.json"
export const PROGRAMS_URL = 'https://data.opensanctions.org/meta/programs.json'
export const LICENSE_URL = "https://creativecommons.org/licenses/by-nc/4.0/"
export const CMS_URL = "https://opensanctions.directus.app"
export const MAIN_DATASET = "default"
export const SEARCH_SCHEMA = "Thing"
export const CLAIM = "Find sanctions targets and persons of interest"
export const SUBCLAIM = "OpenSanctions helps investigators find leads, allows companies to manage risk and enables technologists to build data-driven products."
export const EMAIL = "info@everypolitician.org"
export const FEATURED_COLLECTIONS = ['default', 'sanctions'];
export const EXTRA_COLLECTIONS = ['peps', 'securities', 'maritime', 'kyb', 'openownership', 'crime'];
export const GA_TRACKING_ID = 'G-YRZENQXNNR';
export const REVALIDATE_BASE = 3600;
export const THEME_COLOR = '#2563eb';
export const SOCIAL_IMAGE_URL = "https://assets.opensanctions.org/images/ura/social.png";
export const RSS_MIME = "application/rss+xml";
export const MAX_FILTERS_PER_FACET = 3;
export const MAX_FILTERS = 5;

export const API_TOKEN = process.env.API_TOKEN

// client-side variables
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.opensanctions.org"
export const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "ep_site_token"

// fake up a semantic ordering of collections
export const COLLECTIONS = ['default', 'sanctions', 'peps', 'crime'];

export const SPACER = " · ";
