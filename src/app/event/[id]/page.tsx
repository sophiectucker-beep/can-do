'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Calendar from '@/components/Calendar';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface Participant {
  id: string;
  name: string;
  selectedDates: string[];
  isCreator: boolean;
}

interface EventData {
  id: string;
  title: string;
  creatorName: string;
  participants: Participant[];
  matchingDates: string[];
}

export default function EventPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  const [visitorId, setVisitorId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editingName, setEditingName] = useState(false);
  const weCanDoRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Get or create visitor ID on mount
  useEffect(() => {
    const storedId = localStorage.getItem(`can-do-${eventId}`);
    if (storedId) {
      setVisitorId(storedId);
    } else {
      // New visitor - show name prompt
      const newId = uuidv4();
      setVisitorId(newId);
      setShowNamePrompt(true);
    }
  }, [eventId]);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);

        // Set user's selected dates and name if they exist (only if no unsaved changes)
        const participant = data.participants.find(
          (p: Participant) => p.id === visitorId
        );
        if (participant && !hasUnsavedChanges && !editingName) {
          setSelectedDates(participant.selectedDates);
          setUserName(participant.name);
          setShowNamePrompt(false);
        }
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, visitorId, hasUnsavedChanges, editingName]);

  useEffect(() => {
    if (visitorId) {
      fetchEvent();
      // Poll for updates every 5 seconds
      const interval = setInterval(fetchEvent, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchEvent, visitorId]);

  const handleDateToggle = (dateStr: string) => {
    setHasUnsavedChanges(true);
    setSelectedDates(prev =>
      prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const saveDates = async () => {
    if (!userName.trim()) {
      setShowNamePrompt(true);
      return;
    }

    setIsSaving(true);
    try {
      // Store visitorId in localStorage
      localStorage.setItem(`can-do-${eventId}`, visitorId);

      const response = await fetch(`/api/events/${eventId}/dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          name: userName.trim(),
          dates: selectedDates
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvent(data);
        setShowNamePrompt(false);
        setHasUnsavedChanges(false);
        setHasSaved(true);

        // On mobile, scroll to "We can do" section after saving
        if (window.innerWidth < 1024 && weCanDoRef.current) {
          setTimeout(() => {
            weCanDoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error saving dates:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyShareLink = () => {
    const url = window.location.href.split('?')[0]; // Remove any query params
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCreator = event?.participants.some(p => p.id === visitorId && p.isCreator) ?? false;

  const startEditingTitle = () => {
    if (!isCreator || !event) return;
    setEditedTitle(event.title);
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const saveTitle = async () => {
    if (!editedTitle.trim() || !event || editedTitle.trim() === event.title) {
      setEditingTitle(false);
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/title`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, title: editedTitle.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      }
    } catch (error) {
      console.error('Error updating title:', error);
    } finally {
      setEditingTitle(false);
    }
  };

  const saveName = async () => {
    if (!userName.trim() || !event) {
      setEditingName(false);
      return;
    }

    // Check if name actually changed
    const participant = event.participants.find(p => p.id === visitorId);
    if (participant && participant.name === userName.trim()) {
      setEditingName(false);
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/name`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, name: userName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      }
    } catch (error) {
      console.error('Error updating name:', error);
    } finally {
      setEditingName(false);
    }
  };

  // Get participant selections for calendar display
  const participantSelections: Record<string, string[]> = {};
  event?.participants.forEach(p => {
    participantSelections[p.name] = p.selectedDates;
  });

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-light)] font-light">Loading...</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-light)] font-light">Event not found</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 pt-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 lg:mb-8">
          <a href="/" className="inline-block hover:opacity-80 transition-opacity">
            <img
              src="/logo.png"
              alt="Can Do"
              className="h-12 md:h-14 w-auto mx-auto"
            />
          </a>
        </div>

        {/* Event Title, Creator & User Name */}
        <div className="text-center mb-4 lg:mb-8">
          {editingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveTitle();
                  titleInputRef.current?.blur();
                }
                if (e.key === 'Escape') {
                  setEditingTitle(false);
                }
              }}
              className="text-3xl font-light tracking-wide text-[var(--foreground)] mb-1
                         px-4 py-1.5 bg-white border border-[var(--pastel-pink)] focus:border-[var(--accent)]
                         focus:outline-none text-center rounded-lg max-w-lg mx-auto block"
            />
          ) : (
            <div
              className={`group mb-1 inline-flex items-center gap-1 ${isCreator ? 'cursor-pointer' : ''}`}
              onClick={() => isCreator && startEditingTitle()}
            >
              <h1 className="text-3xl font-light tracking-wide text-[var(--foreground)]">
                {event.title}
              </h1>
              {isCreator && (
                <svg
                  className="w-5 h-5 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity
                             lg:block hidden"
                  fill="none" stroke="currentColor" viewBox="-1 -1 26 26"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              )}
            </div>
          )}
          <p className="text-xs text-[var(--text-light)] font-light mb-3">
            created by {event.creatorName}
          </p>
          {editingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              autoFocus
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userName.trim()) {
                  saveName();
                  nameInputRef.current?.blur();
                }
                if (e.key === 'Escape') {
                  setEditingName(false);
                }
              }}
              className="px-3 py-1.5 bg-white border border-[var(--pastel-pink)]
                         focus:border-[var(--accent)] focus:outline-none
                         text-center font-light rounded-lg w-48"
            />
          ) : (
            <div
              className="group inline-flex items-center gap-1 cursor-pointer"
              onClick={() => setEditingName(true)}
            >
              <span className="font-light text-[var(--foreground)] border-b border-[var(--pastel-pink)]">
                {userName || 'Your name'}
              </span>
              <svg
                className="w-5 h-5 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity
                           lg:block hidden"
                fill="none" stroke="currentColor" viewBox="-1 -1 26 26"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
            </div>
          )}
        </div>

        {/* Name Prompt Modal */}
        {showNamePrompt && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-lg">
              <h2 className="text-xl font-light text-center mb-4 text-[var(--foreground)]">
                What&apos;s your name?
              </h2>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                className="w-full px-4 py-3 bg-white border border-[var(--pastel-pink)]
                           focus:border-[var(--accent)] focus:outline-none
                           text-center font-light rounded-xl mb-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && userName.trim()) {
                    setShowNamePrompt(false);
                  }
                }}
              />
              <button
                onClick={() => userName.trim() && setShowNamePrompt(false)}
                disabled={!userName.trim()}
                className="w-full px-4 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)]
                           text-[var(--text-light)] hover:text-white font-light tracking-wide transition-colors rounded-xl
                           disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Calendar Section */}
          <div className="flex-1">
            <div className="bg-white/60 p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-light text-center mb-4 text-[var(--foreground)]">
                Select your available dates
              </h2>
              <Calendar
                selectedDates={selectedDates}
                onDateToggle={handleDateToggle}
                matchingDates={event.matchingDates}
                participantSelections={participantSelections}
              />

              <button
                onClick={saveDates}
                disabled={isSaving || !userName.trim()}
                className="w-full mt-4 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)]
                           text-[var(--foreground)] hover:text-white font-light tracking-wide transition-colors
                           disabled:opacity-50 rounded-xl"
              >
                {isSaving ? 'Saving...' : 'Save My Dates'}
              </button>
            </div>
          </div>

          {/* Matching Dates Section */}
          <div className="lg:w-72" ref={weCanDoRef}>
            <div className="bg-white/60 p-6 rounded-2xl shadow-sm sticky top-8">
              <h2 className="text-lg font-light text-center mb-4 text-[var(--foreground)]">
                We can do:
              </h2>

              {event.matchingDates.length > 0 ? (
                <>
                  <ul className="space-y-2">
                    {event.matchingDates.map(date => (
                      <li
                        key={date}
                        className="px-4 py-3 bg-[var(--pastel-green)] rounded-xl
                                   text-center font-light text-[var(--foreground)]"
                      >
                        {format(new Date(date), 'EEEE, MMM d')}
                      </li>
                    ))}
                  </ul>
                  {/* Mobile share link - shown below dates */}
                  <button
                    onClick={copyShareLink}
                    className="lg:hidden mt-4 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]
                               font-light underline underline-offset-2 block mx-auto transition-colors"
                  >
                    {copied ? 'Link copied!' : 'Share the link with friends!'}
                  </button>
                </>
              ) : (
                <p className="text-sm text-[var(--text-light)] font-light text-center">
                  No matching dates yet.
                  {event.participants.length < 2 ? (
                    <>
                      {' '}
                      <button
                        onClick={copyShareLink}
                        className="text-[var(--accent)] hover:text-[var(--accent-hover)]
                                   underline underline-offset-2 transition-colors"
                      >
                        {copied ? 'Link copied!' : 'Share the link with friends!'}
                      </button>
                    </>
                  ) : (
                    ' Select more dates to find overlap!'
                  )}
                </p>
              )}

              {/* Friends */}
              <div className="mt-6 pt-4 border-t border-[var(--pastel-pink)]">
                <h3 className="text-sm font-light text-[var(--text-light)] mb-2">
                  Friends ({event.participants.length})
                </h3>
                <ul className="space-y-1">
                  {event.participants.map(p => (
                    <li
                      key={p.id}
                      className="text-xs font-light text-[var(--foreground)] flex items-center gap-2"
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        p.selectedDates.length > 0 ? 'bg-[var(--success)]' : 'bg-[var(--pastel-pink)]'
                      }`} />
                      {p.name} {p.isCreator && '(creator)'}
                      {p.id === visitorId && ' (you)'}
                      <span className="text-[var(--text-light)] relative group/dates cursor-help">
                        ({p.selectedDates.length} {p.selectedDates.length === 1 ? 'date' : 'dates'})
                        {p.selectedDates.length > 0 && (
                          <span className="hidden group-hover/dates:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                                          bg-white rounded-lg shadow-lg p-3 border border-[var(--pastel-pink)]
                                          whitespace-nowrap pointer-events-none">
                            <span className="text-[11px] text-[var(--foreground)] block">
                              {p.selectedDates
                                .sort()
                                .map(d => format(new Date(d), 'MMM d'))
                                .join(', ')}
                            </span>
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Desktop Share Section */}
              <div className="hidden lg:block mt-6 pt-4 border-t border-[var(--pastel-pink)]">
                <h3 className="text-sm font-light text-[var(--text-light)] mb-3">
                  Share with Friends
                </h3>
                <button
                  onClick={copyShareLink}
                  className="w-full px-4 py-3 bg-[var(--pastel-purple)] hover:bg-[var(--pastel-blue)]
                             text-[var(--foreground)] font-light tracking-wide transition-colors rounded-xl text-sm"
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Share Button - Mobile Only, appears after saving */}
      {hasSaved && (
        <div className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2">
          {showShareTooltip && (
            <button
              onClick={() => {
                copyShareLink();
                setShowShareTooltip(false);
              }}
              className="px-4 py-2 bg-white rounded-full shadow-lg border border-[var(--pastel-pink)]
                         text-sm font-light text-[var(--foreground)] active:scale-95 transition-all"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          )}
          <button
            onClick={() => setShowShareTooltip(prev => !prev)}
            className="w-14 h-14 bg-[var(--pastel-purple)] hover:bg-[var(--pastel-blue)]
                       rounded-full shadow-lg flex items-center justify-center transition-all
                       active:scale-95"
            aria-label="Share link"
          >
            {copied ? (
              <svg className="w-6 h-6 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            )}
          </button>
        </div>
      )}
    </main>
  );
}
