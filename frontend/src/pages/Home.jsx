import { useState, useEffect } from 'react';
import { shortenUrl } from '../services/urlApi';
import { useUrlShortener } from '../hooks/useUrlShortener';
import { Header } from '../components/Header';
import { UrlForm } from '../components/UrlForm';
import { ResultCard } from '../components/ResultCard';

/**
 * Home Page - Main landing page with URL shortening form
 */
export function Home() {
  const { loading, error, shortenedUrl, shorten, reset } = useUrlShortener();
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleShorten = async (formData) => {
    try {
      await shorten(formData, shortenUrl);
      setShowAnalytics(true);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      <Header />
      
      <main className="w-full max-w-3xl mx-auto mt-10">
        <div className="text-center mb-10 fade-in">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-accent-700 bg-accent-50 border border-accent-100 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
            Free · No sign-up
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-ink mb-4 leading-tight">
            Long links,{' '}
            <span className="accent-underline">made short</span>
          </h1>
          <p className="text-lg text-ink-faint max-w-xl mx-auto">
            Paste a URL, get a clean short link in seconds.
            Track clicks, customize aliases, and set expiry dates.
          </p>
        </div>

        <div className="mb-8 fade-in" style={{ animationDelay: '0.08s' }}>
          <UrlForm onSubmit={handleShorten} loading={loading} error={error} />
        </div>

        {shortenedUrl && showAnalytics && (
          <div className="fade-in" style={{ animationDelay: '0.16s' }}>
            <ResultCard urlData={shortenedUrl} onReset={reset} />
          </div>
        )}

        {!showAnalytics && !shortenedUrl && (
          <div className="bg-white border border-line rounded-2xl shadow-card p-8 mt-8 fade-in" style={{ animationDelay: '0.16s' }}>
            <h2 className="font-display text-xl font-bold mb-8 text-ink text-center">How it works</h2>
            <div className="grid md:grid-cols-3 gap-px bg-line rounded-xl overflow-hidden border border-line">
              {[
                { n: '01', title: 'Paste your URL', desc: 'Drop in any long, messy link — aliases and expiry are optional.' },
                { n: '02', title: 'Get a short link', desc: 'A clean, compact URL is generated instantly and copied in one click.' },
                { n: '03', title: 'Share & track', desc: 'Share it anywhere and watch real-time click analytics roll in.' },
              ].map((step) => (
                <div key={step.n} className="bg-white p-6 text-left">
                  <span className="font-display text-sm font-semibold text-accent-600">{step.n}</span>
                  <h3 className="font-semibold text-ink mt-2 mb-1.5">{step.title}</h3>
                  <p className="text-ink-faint text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
