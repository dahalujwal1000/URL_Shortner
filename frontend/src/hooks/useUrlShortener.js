import { useState, useCallback } from 'react';

/**
 * Hook for URL shortening functionality
 * @returns {Object} State and functions for URL shortening
 */
export function useUrlShortener() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shortenedUrl, setShortenedUrl] = useState(null);

  const shorten = useCallback(async ({ originalUrl, customAlias, expiresAt }, apiCall) => {
    setLoading(true);
    setError(null);
    setShortenedUrl(null);

    try {
      const result = await apiCall(originalUrl, customAlias, expiresAt);
      setShortenedUrl(result.data);
      return result.data;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setShortenedUrl(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    shortenedUrl,
    shorten,
    reset,
  };
}

/**
 * Hook for copying text to clipboard
 * @param {string} text - The text to copy
 * @returns {Object} Copy function and copied state
 */
export function useCopyToClipboard(text) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [text]);

  return { copied, copy };
}
