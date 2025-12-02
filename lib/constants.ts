
export const SITE = "EveryPolitician"
export const BASE_URL = "https://www.everypolitician.org"
export const OSA_URL = "https://www.opensanctions.org"
export const INDEX_URL = "https://data.opensanctions.org/datasets/latest/index.json"
export const MODEL_URL = "https://data.opensanctions.org/meta/model.json"
export const LICENSE_URL = "https://creativecommons.org/licenses/by-nc/4.0/"
export const CMS_URL = "https://opensanctions.directus.app"
export const MAIN_DATASET = "default"
export const KYB_DATASET = "kyb"
export const SEARCH_SCHEMA = "Thing"
export const DEFAULT_ALGORITHM = "logic-v2"
export const CLAIM = "Who is running the world?"
export const SUBCLAIM = "EveryPolitician is a global database of political office-holders, from rulers, law-makers to judges and more."
export const EMAIL = "info@opensanctions.org"
export const FEATURED_COLLECTIONS = ['default', 'sanctions'];
export const EXTRA_COLLECTIONS = ['peps', 'securities', 'maritime', 'kyb', 'openownership', 'crime'];
export const ARTICLE_INDEX_SUMMARY = "Updates from OpenSanctions, including new features, technical deep dives, and analysis."
export const GA_TRACKING_ID = 'G-KGY1GYY598';
export const REVALIDATE_SHORT = 300;
export const REVALIDATE_BASE = 3600 * 2;
export const REVALIDATE_LONG = REVALIDATE_BASE * 2;
export const REVALIDATE_CMS = 3600 * 2;
export const THEME_COLOR = '#2563eb';
export const SOCIAL_IMAGE_URL = "https://assets.opensanctions.org/images/nura/social.png";
export const ARTICLE_DEFAULT_IMAGE = "bb87de0a-1bc2-459b-a483-7f2d80f8273c";
export const RSS_MIME = "application/rss+xml";
export const TRIAL_QUOTA = 2000;
export const MAX_FILTERS_PER_FACET = 3;
export const MAX_FILTERS = 5;

export const API_TOKEN = process.env.API_TOKEN

// client-side variables
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.opensanctions.org"
export const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "ep_site_token"

// fake up a semantic ordering of collections
export const COLLECTIONS = ['default', 'sanctions', 'peps', 'crime'];

export const SPACER = " · ";

export const BLOCKED_ENTITIES = ['Q42'];