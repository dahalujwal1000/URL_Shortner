import React from 'react';

/**
 * Analytics Details - Shows short URL configuration details
 * @param {Object} props
 * @param {Object} props.data - Analytics data
 */
export function AnalyticsDetails({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Short URL Details</h2>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-500">Short Code</label>
          <p className="font-medium font-mono text-lg">{data.shortCode}</p>
        </div>
        {data.customAlias && (
          <div>
            <label className="text-sm text-gray-500">Custom Alias</label>
            <p className="font-medium">{data.customAlias}</p>
          </div>
        )}
        {data.expiresAt && (
          <div>
            <label className="text-sm text-gray-500">Expires At</label>
            <p className="font-medium">
              {new Date(data.expiresAt).toLocaleString()}
            </p>
          </div>
        )}
        <div>
          <label className="text-sm text-gray-500">Status</label>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            data.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {data.isActive ? 'Active' : 'Deactivated'}
          </span>
        </div>
      </div>
    </div>
  );
}
