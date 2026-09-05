import React, { useState } from 'react';

/**
 * URL Form Component
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback with form data
 * @param {boolean} props.loading - Loading state
 * @param {string|null} props.error - Error message
 */
export function UrlForm({ onSubmit, loading, error }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;
    
    onSubmit({
      originalUrl: originalUrl.trim(),
      customAlias: customAlias.trim() || null,
      expiresAt: expiresAt || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl shadow-card p-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter your long URL
        </label>
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com/very/long/path/that/you/want/to/shorten"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-colors"
          required
          disabled={loading}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Alias (optional)
          </label>
          <input
            type="text"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            placeholder="e.g. my-brand-link"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-colors"
            disabled={loading}
            pattern="[a-zA-Z0-9]{3,20}"
            title="3-20 alphanumeric characters"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiration Date (optional)
          </label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-colors"
            disabled={loading}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !originalUrl.trim()}
        className={`w-full py-4 px-6 rounded-lg font-medium transition-all ${
          loading || !originalUrl.trim()
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-ink text-white hover:bg-black shadow-card hover:shadow-lift active:scale-[0.99]'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Shortening...</span>
          </div>
        ) : (
          'Shorten URL →'
        )}
      </button>
    </form>
  );
}
