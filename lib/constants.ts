
export const SITE = "EveryPolitician"
export const BASE_URL = "https://www.everypolitician.org"
export const OSA_URL = "https://www.opensanctions.org"
export const LICENSE_URL = "https://creativecommons.org/licenses/by-nc/4.0/"
export const CMS_URL = "https://opensanctions.directus.app"
export const MAIN_DATASET = "default"
export const CLAIM = "Who is running the world?"
export const SUBCLAIM = "EveryPolitician is a global database of political office-holders, from rulers, law-makers to judges and more."
export const EMAIL = "info@opensanctions.org"
export const FEATURED_COLLECTIONS = ['default', 'sanctions'];
export const EXTRA_COLLECTIONS = ['peps', 'securities', 'maritime', 'kyb', 'openownership', 'crime'];
export const GA_TRACKING_ID = 'G-KGY1GYY598';
export const REVALIDATE_BASE = 3600 * 2;
export const REVALIDATE_LONG = REVALIDATE_BASE * 2;
export const THEME_COLOR = '#2563eb';
export const SOCIAL_IMAGE_URL = "https://assets.opensanctions.org/images/nura/social.png";
export const RSS_MIME = "application/rss+xml";
export const MAX_FILTERS_PER_FACET = 3;

export const API_TOKEN = process.env.API_TOKEN

// client-side variables
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.opensanctions.org"

export const SPACER = " · ";

export const BLOCKED_ENTITIES = ['Q42'];