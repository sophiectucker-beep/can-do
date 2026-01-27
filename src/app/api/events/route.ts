import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { title, creatorName } = await request.json();

    if (!title || !creatorName) {
      return NextResponse.json(
        { error: 'Title and creator name are required' },
        { status: 400 }
      );
    }

    const event = await createEvent(title, creatorName);
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
