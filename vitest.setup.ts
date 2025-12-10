import '@testing-library/jest-dom'
import { vi, beforeEach, afterEach } from 'vitest'

// Mock server-only module (Next.js server components marker)
vi.mock('server-only', () => ({}))

// Mock Next.js cache functions - they just pass through the function in tests
vi.mock('next/cache', () => ({
  unstable_cache: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    _keyParts?: string[],
    _options?: { revalidate?: number; tags?: string[] }
  ) => fn,
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

// Mock localStorage for jsdom environment
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(() => null),
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

// Store original fetch
const originalFetch = global.fetch

// Mock fetch handlers - tests add handlers here
type FetchHandler = (url: string, options?: RequestInit) => Promise<Response> | null
let fetchHandlers: FetchHandler[] = []

export function addFetchHandler(handler: FetchHandler) {
  fetchHandlers.push(handler)
}

export function clearFetchHandlers() {
  fetchHandlers = []
}

// Create a mock fetch that routes to handlers
const mockFetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input.toString()

  for (const handler of fetchHandlers) {
    const response = handler(url, init)
    if (response) return response
  }

  // If no handler matched, throw a helpful error
  throw new Error(`No fetch handler for: ${url}`)
})

// Setup and teardown
beforeEach(() => {
  global.fetch = mockFetch as typeof fetch
  mockFetch.mockClear()
})

afterEach(() => {
  clearFetchHandlers()
  global.fetch = originalFetch
})

// Re-export for tests
export { mockFetch }
