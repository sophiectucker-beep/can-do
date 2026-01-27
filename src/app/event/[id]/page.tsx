'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Calendar from '@/components/Calendar';
import { format } from 'date-fns';

interface Participant {
  id: string;
  email: string;
  selectedDates: string[];
  isCreator: boolean;
}

interface EventData {
  id: string;
  title: string;
  creatorEmail: string;
  participants: Participant[];
  invitedEmails: string[];
  matchingDates: string[];
}

export default function EventPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.id as string;
  const userEmail = searchParams.get('email') || '';

  const [event, setEvent] = useState<EventData | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isCreator = event?.creatorEmail === userEmail;

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);

        // Set user's selected dates if they exist
        const participant = data.participants.find(
          (p: Participant) => p.email === userEmail
        );
        if (participant) {
          setSelectedDates(participant.selectedDates);
        }
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, userEmail]);

  useEffect(() => {
    fetchEvent();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchEvent, 5000);
    return () => clearInterval(interval);
  }, [fetchEvent]);

  const handleDateToggle = (dateStr: string) => {
    setSelectedDates(prev =>
      prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const saveDates = async () => {
    if (!userEmail) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/events/${eventId}/dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, dates: selectedDates }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      }
    } catch (error) {
      console.error('Error saving dates:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      const response = await fetch(`/api/events/${eventId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setShareLink(data.shareUrl);
        setInviteEmail('');
        fetchEvent();
      }
    } catch (error) {
      console.error('Error inviting:', error);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  // Get participant selections for calendar display
  const participantSelections: Record<string, string[]> = {};
  event?.participants.forEach(p => {
    participantSelections[p.email] = p.selectedDates;
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
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-extralight tracking-wider text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
            Can Do
          </a>
        </div>

        {/* Event Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-wide text-[var(--foreground)] mb-2">
            {event.title}
          </h1>
          <p className="text-sm text-[var(--text-light)] font-light">
            {isCreator ? 'You created this event' : `Created by ${event.creatorEmail}`}
          </p>
          <p className="text-xs text-[var(--text-light)] font-light mt-1">
            Logged in as: {userEmail}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
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
                disabled={isSaving}
                className="w-full mt-6 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)]
                           text-white font-light tracking-wide transition-colors
                           disabled:opacity-50 rounded-xl"
              >
                {isSaving ? 'Saving...' : 'Save My Dates'}
              </button>
            </div>

            {/* Invite Section - Only for creator */}
            {isCreator && (
              <div className="bg-white/60 p-6 rounded-2xl shadow-sm mt-6">
                <h2 className="text-lg font-light text-center mb-4 text-[var(--foreground)]">
                  Invite Friends
                </h2>
                <form onSubmit={handleInvite} className="space-y-4">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter friend's email"
                    className="w-full px-4 py-3 bg-white border border-[var(--pastel-pink)]
                               focus:border-[var(--accent)] focus:outline-none
                               text-center font-light rounded-xl"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-[var(--pastel-purple)] hover:bg-[var(--pastel-blue)]
                               text-[var(--foreground)] font-light tracking-wide transition-colors rounded-xl"
                  >
                    Generate Invite Link
                  </button>
                </form>

                {shareLink && (
                  <div className="mt-4 p-4 bg-[var(--pastel-mint)] rounded-xl">
                    <p className="text-xs font-light text-[var(--foreground)] mb-2 text-center">
                      Share this link:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white text-xs font-light rounded-lg"
                      />
                      <button
                        onClick={copyShareLink}
                        className="px-4 py-2 bg-[var(--accent)] text-white text-xs rounded-lg
                                   hover:bg-[var(--accent-hover)] transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {/* Invited People */}
                {event.invitedEmails.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-light text-[var(--text-light)] mb-2">
                      Invited: {event.invitedEmails.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Matching Dates Section */}
          <div className="lg:w-72">
            <div className="bg-white/60 p-6 rounded-2xl shadow-sm sticky top-8">
              <h2 className="text-lg font-light text-center mb-4 text-[var(--foreground)]">
                We can do:
              </h2>

              {event.matchingDates.length > 0 ? (
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
              ) : (
                <p className="text-sm text-[var(--text-light)] font-light text-center">
                  No matching dates yet.
                  {event.participants.length < 2
                    ? ' Invite friends to find common availability!'
                    : ' Select more dates to find overlap!'}
                </p>
              )}

              {/* Participants */}
              <div className="mt-6 pt-4 border-t border-[var(--pastel-pink)]">
                <h3 className="text-sm font-light text-[var(--text-light)] mb-2">
                  Participants ({event.participants.length})
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
                      {p.email} {p.isCreator && '(creator)'}
                      <span className="text-[var(--text-light)]">
                        ({p.selectedDates.length} dates)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
