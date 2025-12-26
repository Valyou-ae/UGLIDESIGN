/**
 * CSRF Token Management
 * Fetches and caches CSRF tokens for API requests
 */

let csrfToken: string | null = null;
let tokenPromise: Promise<string> | null = null;

/**
 * Fetch CSRF token from server
 * Cached for the session to avoid repeated requests
 */
export async function getCsrfToken(): Promise<string> {
  // Return cached token if available
  if (csrfToken) {
    return csrfToken;
  }

  // Return existing promise if fetch is in progress
  if (tokenPromise) {
    return tokenPromise;
  }

  // Fetch new token
  tokenPromise = (async () => {
    try {
      const response = await fetch('/api/csrf-token', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
      }

      const data = await response.json();
      csrfToken = data.csrfToken;
      tokenPromise = null;
      return csrfToken!;
    } catch (error) {
      tokenPromise = null;
      throw error;
    }
  })();

  return tokenPromise;
}

/**
 * Clear cached CSRF token
 * Call this after logout or when token becomes invalid
 */
export function clearCsrfToken(): void {
  csrfToken = null;
  tokenPromise = null;
}

/**
 * Add CSRF token to fetch options
 * Automatically fetches token if not cached
 */
export async function withCsrfToken(options: RequestInit = {}): Promise<RequestInit> {
  const method = options.method?.toUpperCase() || 'GET';

  // Only add CSRF token for state-changing methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = await getCsrfToken();

    return {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRF-Token': token,
      },
    };
  }

  return options;
}
