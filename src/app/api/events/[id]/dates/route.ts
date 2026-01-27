import { NextRequest, NextResponse } from 'next/server';
import { updateParticipantDates, getMatchingDates } from '@/lib/storage';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { visitorId, name, dates } = await request.json();

    if (!visitorId || !name || !Array.isArray(dates)) {
      return NextResponse.json(
        { error: 'Visitor ID, name, and dates array are required' },
        { status: 400 }
      );
    }

    const event = await updateParticipantDates(id, visitorId, name, dates);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const matchingDates = getMatchingDates(event);

    return NextResponse.json({
      ...event,
      matchingDates,
    });
  } catch (error) {
    console.error('Error updating dates:', error);
    return NextResponse.json(
      { error: 'Failed to update dates' },
      { status: 500 }
    );
  }
}
