import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCopyToClipboard } from '../hooks/useUrlShortener';
import { getDomain, timeAgo } from '../utils/helpers';

/**
 * Result Card Component
 * Displays the shortened URL with copy and analytics features
 * @param {Object} props
 * @param {Object} props.urlData - The shortened URL data
 * @param {Function} props.onReset - Reset callback
 */
export function ResultCard({ urlData, onReset }) {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const shortUrl = urlData.shortUrl;

  return (
    <div className="bg-white border border-line rounded-2xl shadow-card p-8 mb-8 fade-in">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-accent-50 border border-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold mb-2 text-ink">Your short link is ready</h2>
        <p className="text-ink-faint">
          Original URL: <span className="font-medium text-ink-soft">{getDomain(urlData.originalUrl)}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shortened URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
            />
            <button
              onClick={() => copyToClipboard(shortUrl, 'shortUrl')}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              title="Copy to clipboard"
            >
              {copiedField === 'shortUrl' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {urlData.shortCode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Code
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg font-mono text-lg">{urlData.shortCode}</code>
              <button
                onClick={() => copyToClipboard(urlData.shortCode, 'shortCode')}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                title="Copy short code"
              >
                {copiedField === 'shortCode' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {urlData.customAlias && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Alias
            </label>
            <code className="block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg font-mono">{urlData.customAlias}</code>
          </div>
        )}

        {urlData.expiresAt && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expires At
            </label>
            <p className="text-gray-700">{new Date(urlData.expiresAt).toLocaleString()}</p>
          </div>
        )}

        <div className="pt-2">
          <p className="text-sm text-gray-500 mb-2">
            Created {timeAgo(urlData.createdAt)}
          </p>
        </div>

        <div className="flex gap-4 pt-4 border-t border-line">
          <Link
            to={`/analytics/${urlData.shortCode}`}
            className="flex-1 text-center py-3 px-6 bg-ink text-white rounded-lg hover:bg-black font-medium transition-all active:scale-[0.99]"
          >
            View Analytics
          </Link>
          <button
            onClick={onReset}
            className="flex-1 py-3 px-6 border border-line text-ink-soft rounded-lg hover:bg-paper hover:border-ink-faint font-medium transition-colors"
          >
            Shorten Another
          </button>
        </div>
      </div>
    </div>
  );
}
