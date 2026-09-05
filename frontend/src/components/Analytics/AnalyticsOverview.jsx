import React from 'react';
import { formatNumber, timeAgo, getDomain } from '../../utils/helpers';

/**
 * Analytics Overview - Summary cards showing key metrics
 * @param {Object} props
 * @param {Object} props.data - Analytics data
 */
export function AnalyticsOverview({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Total Clicks</h3>
        <p className="text-3xl font-bold text-purple-600">
          {formatNumber(data.clickCount || 0)}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Original URL</h3>
        <p className="font-medium text-gray-800 break-all">
          {getDomain(data.originalUrl)}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Created</h3>
        <p className="font-medium text-gray-800">
          {timeAgo(data.createdAt)}
        </p>
      </div>
    </div>
  );
}
