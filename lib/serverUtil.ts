import { headers, type UnsafeUnwrappedHeaders } from 'next/headers';
import { IDictionary } from './types';
import pino from 'pino';

export const logger = pino();

export function dynamicRequestDetails(): IDictionary<string | null> {
  const heads = (headers() as unknown as UnsafeUnwrappedHeaders);
  return {
    clientIp: heads.get('x-forwarded-for'),
    userAgent: heads.get('user-agent'),
  }
}