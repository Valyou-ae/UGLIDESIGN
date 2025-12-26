import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('CSRF Utilities', () => {
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {};
    global.localStorage = {
      getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockLocalStorage[key];
      }),
      clear: vi.fn(() => {
        mockLocalStorage = {};
      }),
      length: 0,
      key: vi.fn(),
    } as Storage;

    // Mock fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getCsrfToken', () => {
    it('should return cached token if available', async () => {
      // Dynamically import to avoid module caching issues
      const { getCsrfToken } = await import('@client/lib/csrf');
      
      mockLocalStorage['csrf_token'] = 'cached-token-123';

      const token = await getCsrfToken();
      
      expect(token).toBe('cached-token-123');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fetch new token if not cached', async () => {
      const { getCsrfToken } = await import('@client/lib/csrf');
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ csrfToken: 'new-token-456' }),
      });

      const token = await getCsrfToken();
      
      expect(token).toBe('new-token-456');
      expect(global.fetch).toHaveBeenCalledWith('/api/csrf-token');
      expect(mockLocalStorage['csrf_token']).toBe('new-token-456');
    });

    it('should throw error if fetch fails', async () => {
      const { getCsrfToken } = await import('@client/lib/csrf');
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(getCsrfToken()).rejects.toThrow();
    });

    it('should cache token for subsequent calls', async () => {
      const { getCsrfToken } = await import('@client/lib/csrf');
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ csrfToken: 'new-token-789' }),
      });

      const token1 = await getCsrfToken();
      const token2 = await getCsrfToken();
      
      expect(token1).toBe('new-token-789');
      expect(token2).toBe('new-token-789');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearCsrfToken', () => {
    it('should remove token from localStorage', async () => {
      const { clearCsrfToken } = await import('@client/lib/csrf');
      
      mockLocalStorage['csrf_token'] = 'token-to-clear';

      clearCsrfToken();
      
      expect(mockLocalStorage['csrf_token']).toBeUndefined();
      expect(localStorage.removeItem).toHaveBeenCalledWith('csrf_token');
    });
  });

  describe('refreshCsrfToken', () => {
    it('should clear cached token and fetch new one', async () => {
      const { refreshCsrfToken } = await import('@client/lib/csrf');
      
      mockLocalStorage['csrf_token'] = 'old-token';

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ csrfToken: 'refreshed-token' }),
      });

      const token = await refreshCsrfToken();
      
      expect(token).toBe('refreshed-token');
      expect(mockLocalStorage['csrf_token']).toBe('refreshed-token');
      expect(global.fetch).toHaveBeenCalledWith('/api/csrf-token');
    });
  });
});
