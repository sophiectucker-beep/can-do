import { NextRequest, NextResponse } from 'next/server';
import { deleteParticipant, getMatchingDates } from '@/lib/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { requesterId, participantId } = await request.json();

    if (!requesterId || !participantId) {
      return NextResponse.json(
        { error: 'Requester ID and participant ID are required' },
        { status: 400 }
      );
    }

    const event = await deleteParticipant(id, requesterId, participantId);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found or unauthorized' },
        { status: 404 }
      );
    }

    const matchingDates = getMatchingDates(event);

    return NextResponse.json({
      ...event,
      matchingDates,
    });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json(
      { error: 'Failed to delete participant' },
      { status: 500 }
    );
  }
}
