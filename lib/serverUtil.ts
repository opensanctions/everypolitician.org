import { headers, type UnsafeUnwrappedHeaders } from 'next/headers';
import pino from 'pino';

import { IDictionary } from './types';

export const logger = pino();

export function dynamicRequestDetails(): IDictionary<string | null> {
  const heads = (headers() as unknown as UnsafeUnwrappedHeaders);
  return {
    clientIp: heads.get('x-forwarded-for'),
    userAgent: heads.get('user-agent'),
  }
}