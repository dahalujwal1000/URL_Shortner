import React from 'react';
import { formatNumber } from '../../utils/helpers';

/**
 * Recent Clicks Table - Displays last 100 clicks on the URL
 * @param {Object} props
 * @param {Array} props.clicks - Array of click records
 */
export function RecentClicks({ clicks }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Clicks</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-3 text-sm font-medium text-gray-500">Time</th>
              <th className="pb-3 text-sm font-medium text-gray-500">User Agent</th>
              <th className="pb-3 text-sm font-medium text-gray-500">Referrer</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map((click) => (
              <tr key={click.id} className="border-b last:border-0">
                <td className="py-3 text-sm text-gray-600">
                  {new Date(click.clicked_at).toLocaleString()}
                </td>
                <td className="py-3 text-sm text-gray-600 max-w-xs truncate">
                  {click.user_agent || 'N/A'}
                </td>
                <td className="py-3 text-sm text-gray-600 max-w-xs truncate">
                  {click.referrer || 'Direct'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
