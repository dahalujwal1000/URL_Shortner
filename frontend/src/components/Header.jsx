import React from 'react';

/**
 * Header Component - Site header with logo mark and title
 */
export function Header() {
  return (
    <header className="text-center py-8">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-ink rounded-xl flex items-center justify-center shadow-card">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-accent-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
            />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Short<span className="text-accent-600">.ly</span>
        </h1>
      </div>
      <p className="text-ink-faint text-sm max-w-md mx-auto">
        Fast, reliable link shortening with real-time click analytics
      </p>
    </header>
  );
}
