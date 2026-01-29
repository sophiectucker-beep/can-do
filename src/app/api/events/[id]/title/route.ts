import { NextRequest, NextResponse } from 'next/server';
import { updateEventTitle, getMatchingDates } from '@/lib/storage';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { visitorId, title } = await request.json();

    if (!visitorId || !title?.trim()) {
      return NextResponse.json(
        { error: 'Visitor ID and title are required' },
        { status: 400 }
      );
    }

    const event = await updateEventTitle(id, visitorId, title.trim());

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found or not authorized' },
        { status: 404 }
      );
    }

    const matchingDates = getMatchingDates(event);

    return NextResponse.json({
      ...event,
      matchingDates,
    });
  } catch (error) {
    console.error('Error updating title:', error);
    return NextResponse.json(
      { error: 'Failed to update title' },
      { status: 500 }
    );
  }
}
