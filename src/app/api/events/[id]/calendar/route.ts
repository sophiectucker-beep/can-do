import { NextRequest, NextResponse } from 'next/server';
import { getEvent } from '@/lib/storage';

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function toIcsDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function parseIsoDate(dateStr: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return new Date(Date.UTC(year, month - 1, day));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const dateParam = request.nextUrl.searchParams.get('date');
    if (!dateParam) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const start = parseIsoDate(dateParam);
    if (!start) {
      return NextResponse.json({ error: 'Date must be yyyy-mm-dd' }, { status: 400 });
    }

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const eventUrl = `${request.nextUrl.origin}/event/${id}`;
    const summary = escapeIcsText(event.title || 'Can Do event');
    const description = escapeIcsText(`Planned with Can Do: ${eventUrl}`);
    const uid = `${id}-${dateParam}@can-do`;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Can Do//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `DTSTART;VALUE=DATE:${toIcsDate(start)}`,
      `DTEND;VALUE=DATE:${toIcsDate(end)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `inline; filename="can-do-${id}-${dateParam}.ics"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error building calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to build calendar event' },
      { status: 500 }
    );
  }
}
