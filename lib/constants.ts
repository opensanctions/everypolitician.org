export const BASE_URL = 'https://www.everypolitician.org';
export const OSA_URL = 'https://www.opensanctions.org';
export const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc/4.0/';
export const MAIN_DATASET = 'default';
export const EMAIL = 'info@opensanctions.org';
export const GA_TRACKING_ID = 'G-KGY1GYY598';
export const REVALIDATE_BASE = 3600 * 2;
export const REVALIDATE_LONG = REVALIDATE_BASE * 2;
export const THEME_COLOR = '#2563eb';

export const API_TOKEN = process.env.API_TOKEN;

// client-side variables
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.opensanctions.org';
