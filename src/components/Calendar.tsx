'use client';

import { useState, useRef, useCallback } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  setMonth,
  setYear,
  startOfWeek,
  endOfWeek,
  addYears,
  isBefore,
  startOfDay,
} from 'date-fns';

interface CalendarProps {
  selectedDates: string[];
  onDateToggle: (date: string) => void;
  matchingDates?: string[];
  participantSelections?: Record<string, string[]>;
  currentUserName?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar({
  selectedDates,
  onDateToggle,
  matchingDates = [],
  participantSelections = {},
  currentUserName = '',
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [longPressTooltip, setLongPressTooltip] = useState<{ date: string; voters: string[]; x: number; y: number } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i); // Current year + 5 years

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

  const getSelectionInfo = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const voters: string[] = [];
    Object.entries(participantSelections).forEach(([name, dates]) => {
      // Exclude current user - their selections are shown via selectedDates prop
      if (dates.includes(dateStr) && name !== currentUserName) {
        voters.push(name);
      }
    });
    return voters;
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setShowYearPicker(false);
    setShowMonthPicker(true);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setYear(setMonth(new Date(), monthIndex), selectedYear);
    setCurrentMonth(newDate);
    setShowMonthPicker(false);
  };

  const goToPrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    // Don't go before current month
    if (newDate >= startOfMonth(new Date())) {
      setCurrentMonth(newDate);
    }
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    // Don't go more than 5 years ahead
    const maxDate = addYears(new Date(), 5);
    if (newDate <= maxDate) {
      setCurrentMonth(newDate);
    }
  };

  // Long press handlers for mobile tooltip
  const handleTouchStart = useCallback((dateStr: string, voters: string[], e: React.TouchEvent) => {
    if (voters.length === 0) return;

    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      setLongPressTooltip({
        date: dateStr,
        voters,
        x: touch.clientX,
        y: touch.clientY,
      });
    }, 500); // 500ms long press
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    // Cancel long press if user moves finger
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Month/Year Navigation */}
      <div className="flex items-center justify-between mb-6 px-2">
        <button
          onClick={goToPrevMonth}
          className="p-2 hover:bg-[var(--pastel-pink)] transition-colors rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => {
            setSelectedYear(currentMonth.getFullYear());
            setShowYearPicker(true);
          }}
          className="text-xl font-light tracking-wide text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
        >
          {format(currentMonth, 'MMMM yyyy')}
        </button>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-[var(--pastel-pink)] transition-colors rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Year Picker Modal */}
      {showYearPicker && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-lg">
            <h3 className="text-lg font-light text-center mb-4 text-[var(--foreground)]">
              Select Year
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`px-4 py-3 rounded-xl font-light transition-colors
                    ${year === currentMonth.getFullYear()
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--pastel-pink)] hover:bg-[var(--accent)] hover:text-white'
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowYearPicker(false)}
              className="w-full mt-4 px-4 py-2 text-[var(--text-light)] font-light"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Month Picker Modal */}
      {showMonthPicker && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-lg">
            <h3 className="text-lg font-light text-center mb-4 text-[var(--foreground)]">
              Select Month - {selectedYear}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((month, index) => {
                const isDisabled = selectedYear === currentYear && index < new Date().getMonth();
                return (
                  <button
                    key={month}
                    onClick={() => !isDisabled && handleMonthSelect(index)}
                    disabled={isDisabled}
                    className={`px-2 py-3 rounded-xl font-light text-sm transition-colors
                      ${isDisabled
                        ? 'opacity-30 cursor-not-allowed bg-gray-100'
                        : index === currentMonth.getMonth() && selectedYear === currentMonth.getFullYear()
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--pastel-blue)] hover:bg-[var(--accent)] hover:text-white'
                      }`}
                  >
                    {month.slice(0, 3)}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowMonthPicker(false)}
              className="w-full mt-4 px-4 py-2 text-[var(--text-light)] font-light"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
          const isPast = isBefore(day, startOfDay(new Date()));
          const voters = getSelectionInfo(day);
          const selectionCount = voters.length;
          const isDisabled = !inCurrentMonth || isPast;
          const tooltipText = voters.length > 0 ? voters.join(', ') : '';

          return (
            <button
              key={dateStr}
              onClick={() => !isDisabled && onDateToggle(dateStr)}
              onTouchStart={(e) => handleTouchStart(dateStr, voters, e)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              disabled={isDisabled}
              className={`
                calendar-day aspect-square flex flex-col items-center justify-center
                text-sm font-light transition-all duration-200 relative group/day
                ${isDisabled ? 'opacity-30 cursor-default' : 'cursor-pointer hover:scale-105'}
                ${isPast && inCurrentMonth ? 'bg-gray-100' : ''}
                ${!isPast && selected
                  ? matching
                    ? 'bg-[var(--pastel-green)] text-[var(--foreground)] shadow-md ring-2 ring-[var(--accent)]'
                    : 'bg-[var(--pastel-pink)] text-[var(--foreground)] shadow-md ring-2 ring-[var(--accent)]'
                  : !isPast && matching
                    ? 'bg-[var(--pastel-green)] text-[var(--foreground)] shadow-sm'
                    : !isPast && selectionCount > 0
                      ? 'bg-[var(--pastel-yellow)] text-[var(--foreground)]'
                      : !isPast ? 'bg-white/50 hover:bg-[var(--pastel-pink)]' : ''
                }
              `}
            >
              <span className={selected && !isPast ? 'font-medium' : ''}>{format(day, 'd')}</span>
              {selectionCount > 0 && inCurrentMonth && !isPast && (
                <span className="text-[10px] text-[var(--text-light)] mt-0.5">
                  {selectionCount} {selectionCount === 1 ? 'vote' : 'votes'}
                </span>
              )}
              {voters.length > 0 && !isDisabled && (
                <div className="hidden group-hover/day:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50
                                bg-white rounded-lg shadow-lg p-2 border border-[var(--pastel-pink)]
                                whitespace-nowrap pointer-events-none">
                  <p className="text-[11px] text-[var(--foreground)]">
                    {voters.join(', ')}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-[var(--text-light)]">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-[var(--pastel-pink)] ring-2 ring-[var(--accent)]"></span>
          <span>Your selection</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-[var(--pastel-yellow)]"></span>
          <span>Others voted</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-[var(--pastel-green)]"></span>
          <span>Everyone can do</span>
        </div>
      </div>

      {/* Mobile hint */}
      <p className="lg:hidden mt-3 text-center text-[10px] text-[var(--text-light)]">
        Long press a date to see who voted
      </p>

      {/* Long Press Tooltip Modal */}
      {longPressTooltip && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setLongPressTooltip(null)}
          onTouchStart={() => setLongPressTooltip(null)}
        >
          <div
            className="absolute bg-white rounded-xl shadow-lg p-3 border border-[var(--pastel-pink)]"
            style={{
              left: Math.min(longPressTooltip.x, window.innerWidth - 160),
              top: longPressTooltip.y - 80,
              minWidth: '140px',
            }}
          >
            <p className="text-xs font-medium text-[var(--foreground)] mb-1">
              {format(new Date(longPressTooltip.date), 'MMM d')}
            </p>
            <p className="text-xs text-[var(--text-light)]">
              {longPressTooltip.voters.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
