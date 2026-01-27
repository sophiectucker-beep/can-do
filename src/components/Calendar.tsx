'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

interface CalendarProps {
  selectedDates: string[];
  onDateToggle: (date: string) => void;
  matchingDates?: string[];
  participantSelections?: Record<string, string[]>;
}

export default function Calendar({
  selectedDates,
  onDateToggle,
  matchingDates = [],
  participantSelections = {},
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const isSelected = (day: Date) =>
    selectedDates.some(d => isSameDay(new Date(d), day));

  const isMatching = (day: Date) =>
    matchingDates.some(d => isSameDay(new Date(d), day));

  const getSelectionCount = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    let count = 0;
    Object.values(participantSelections).forEach(dates => {
      if (dates.includes(dateStr)) count++;
    });
    return count;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6 px-2">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-[var(--pastel-pink)] transition-colors rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-light tracking-wide text-[var(--foreground)]">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-[var(--pastel-pink)] transition-colors rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-xs font-light text-[var(--text-light)] py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const selected = isSelected(day);
          const matching = isMatching(day);
          const inCurrentMonth = isSameMonth(day, currentMonth);
          const selectionCount = getSelectionCount(day);

          return (
            <button
              key={dateStr}
              onClick={() => onDateToggle(dateStr)}
              disabled={!inCurrentMonth}
              className={`
                calendar-day aspect-square flex flex-col items-center justify-center
                text-sm font-light transition-all duration-200 relative
                ${!inCurrentMonth ? 'opacity-30 cursor-default' : 'cursor-pointer hover:scale-105'}
                ${matching
                  ? 'bg-[var(--pastel-green)] text-[var(--foreground)] shadow-sm'
                  : selected
                    ? 'bg-[var(--pastel-pink)] text-[var(--foreground)] shadow-sm'
                    : 'bg-white/50 hover:bg-[var(--pastel-yellow)]'
                }
              `}
            >
              <span>{format(day, 'd')}</span>
              {selectionCount > 0 && inCurrentMonth && (
                <span className="text-[10px] text-[var(--text-light)] mt-0.5">
                  {selectionCount} {selectionCount === 1 ? 'vote' : 'votes'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
