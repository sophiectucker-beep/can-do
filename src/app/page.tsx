'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <h1
          className="text-6xl font-bold mb-2 text-[var(--accent)] relative inline-block"
          style={{ fontFamily: 'var(--font-logo), sans-serif', WebkitTextStroke: '0.1px #e89999' }}
        >
          Can Do
          <svg
            className="absolute pointer-events-none"
            style={{
              width: '0.9em',
              height: '0.9em',
              right: '-0.4em',
              bottom: '-0.15em',
            }}
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M10 50 C14 44, 20 40, 24 44 L38 62 C42 54, 52 36, 65 20 C72 12, 80 5, 90 0 L92 1 C82 8, 70 22, 60 38 C50 54, 44 66, 40 74 C38 78, 34 78, 32 74 L16 50 C14 47, 10 47, 10 50Z"
              fill="#f5d0d0"
            />
          </svg>
        </h1>
        <p className="text-[var(--text-light)] font-light mb-12">
          find the perfect date together
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            {isLoading ? 'Creating...' : 'Create Calendar'}
          </button>
        </form>

        <p className="mt-8 text-xs text-[var(--text-light)] font-light">
          Create a shared calendar and share the link with friends to find dates that work for everyone
        </p>
      </div>
    </main>
  );
}
