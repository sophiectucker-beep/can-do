'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch event count for social proof
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setEventCount(data.count))
      .catch(() => setEventCount(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !name.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), creatorName: name.trim() }),
      });

      if (response.ok) {
        const event = await response.json();
        // Store creator's ID in localStorage to identify them
        localStorage.setItem(`can-do-${event.id}`, event.participants[0].id);
        router.push(`/event/${event.id}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-8">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* Logo */}
        <h1
          className="text-6xl font-bold mb-2 text-[var(--accent)] relative inline-block"
          style={{ fontFamily: 'var(--font-logo), sans-serif', textShadow: '0 0 0.02em #d48a8a' }}
        >
          Can Do
        </h1>
        <p className="text-[var(--text-light)] font-light mb-12">
          find the perfect date together
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the event? (e.g. Sophie's Hen Do)"
              className="w-full px-6 py-4 bg-white border border-[var(--pastel-pink)]
                         focus:border-[var(--accent)] focus:outline-none
                         text-center font-light text-lg placeholder:text-sm
                         transition-colors shadow-sm"
            />
          </div>

          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-6 py-4 bg-white border border-[var(--pastel-pink)]
                         focus:border-[var(--accent)] focus:outline-none
                         text-center font-light placeholder:text-sm
                         transition-colors shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !name.trim() || isLoading}
            className="w-full px-6 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)]
                       text-[var(--text-light)] hover:text-white font-light tracking-wide
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-sm"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : (
              'Create Calendar'
            )}
          </button>
        </form>

        {/* Social Proof */}
        {eventCount !== null && eventCount > 0 && (
          <p className="text-xs text-white font-light mt-10 bg-[#7c9885] px-5 py-2.5 rounded-full shadow-sm">
            🎉 {eventCount.toLocaleString()} {eventCount === 1 ? 'event' : 'events'} created and counting!
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="text-xs text-[var(--text-light)] font-light opacity-60">
          Built after one too many &ldquo;when works for everyone?&rdquo; texts 💬
        </p>
        <p className="text-[10px] text-[var(--text-light)] font-light opacity-40 mt-1">
          by SCT
        </p>
      </footer>
    </main>
  );
}
