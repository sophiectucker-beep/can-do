import { NextRequest, NextResponse } from 'next/server';
import { updateParticipantName, getMatchingDates } from '@/lib/storage';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { visitorId, name } = await request.json();

    if (!visitorId || !name?.trim()) {
      return NextResponse.json(
        { error: 'Visitor ID and name are required' },
        { status: 400 }
      );
    }

    const event = await updateParticipantName(id, visitorId, name.trim());

    if (!event) {
      return NextResponse.json(
        { error: 'Event or participant not found' },
        { status: 404 }
      );
    }

    const matchingDates = getMatchingDates(event);

    return NextResponse.json({
      ...event,
      matchingDates,
    });
  } catch (error) {
    console.error('Error updating name:', error);
    return NextResponse.json(
      { error: 'Failed to update name' },
      { status: 500 }
    );
  }
}
