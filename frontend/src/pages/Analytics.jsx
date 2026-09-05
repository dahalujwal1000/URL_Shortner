import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalytics } from '../services/urlApi';
import { AnalyticsOverview } from '../components/Analytics/AnalyticsOverview';
import { AnalyticsDetails } from '../components/Analytics/AnalyticsDetails';
import { RecentClicks } from '../components/Analytics/RecentClicks';

/**
 * Analytics Page - Shows detailed analytics for a shortened URL
 */
export function Analytics() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAnalytics(shortCode);
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-600 text-3xl">!</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Error Loading Analytics</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Back
          </button>
          <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
        </div>

        <AnalyticsOverview data={data} />
        <AnalyticsDetails data={data} />
        {data.recentClicks && data.recentClicks.length > 0 && (
          <RecentClicks clicks={data.recentClicks} />
        )}
      </div>
    </div>
  );
}
