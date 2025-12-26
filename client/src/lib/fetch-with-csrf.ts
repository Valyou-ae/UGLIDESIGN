/**
 * Fetch wrapper that automatically includes CSRF tokens
 * Use this for any direct fetch() calls that aren't using the api.ts client
 */

import { withCsrfToken } from './csrf';

/**
 * Fetch with automatic CSRF token injection
 * Drop-in replacement for fetch() that adds CSRF tokens to state-changing requests
 */
export async function fetchWithCsrf(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  // Add CSRF token for state-changing methods
  const optionsWithCsrf = await withCsrfToken(init || {});
  
  return fetch(input, optionsWithCsrf);
}
