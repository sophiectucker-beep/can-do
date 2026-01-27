import { NextRequest, NextResponse } from 'next/server';
import { getEvent, getMatchingDates, updateEventTitle } from '@/lib/storage';

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

    const matchingDates = getMatchingDates(event);

    return NextResponse.json({
      ...event,
      matchingDates,
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, requestorEmail } = await request.json();

    if (!title || !requestorEmail) {
      return NextResponse.json(
        { error: 'Title and requestor email are required' },
        { status: 400 }
      );
    }

    const event = await updateEventTitle(id, title, requestorEmail);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}
