import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUrlDetails } from '../services/urlApi';
import { timeAgo, getDomain, formatNumber } from '../utils/helpers';

/**
 * Redirect Handler Page - Shows redirect info while redirecting to original URL
 * Also serves as a fallback page if redirect fails
 */
export function RedirectHandler() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [urlData, setUrlData] = useState(null);
  const [error, setError] = useState(null);
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    const fetchUrlDetails = async () => {
      try {
        const result = await getUrlDetails(shortCode);
        setUrlData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'URL not found');
      }
    };

    fetchUrlDetails();
    
    // Attempt redirect after a brief delay (shows loading UI)
    if (!redirectAttempted) {
      setRedirectAttempted(true);
      // The backend handles the actual redirect, but we show this page
      // as a fallback if the redirect didn't happen automatically
      setTimeout(() => {
        if (urlData) {
          window.location.href = urlData.originalUrl;
        }
      }, 5000);
    }
  }, [shortCode, redirectAttempted, urlData]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-600 text-3xl">!</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">URL Not Found</h1>
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

  if (!urlData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
          <p className="text-gray-600">
            You're being redirected to your destination. Please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-lg">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Redirecting you now...</h1>
        <p className="text-gray-600 mb-4">
          You're being redirected to:
        </p>
        <p className="font-medium text-purple-600 mb-6 break-all">
          {urlData.originalUrl}
        </p>
        
        {urlData.shortCode && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Short code: <span className="font-semibold">{urlData.shortCode}</span>
            </p>
            {urlData.clickCount !== undefined && (
              <p className="text-sm text-gray-600 mt-1">
                Total clicks: <span className="font-semibold">{formatNumber(urlData.clickCount)}</span>
              </p>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => window.location.href = urlData.originalUrl}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium mr-4"
          >
            Go Now
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
