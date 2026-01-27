import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { title, creatorEmail } = await request.json();

    if (!title || !creatorEmail) {
      return NextResponse.json(
        { error: 'Title and creator email are required' },
        { status: 400 }
      );
    }

    const event = await createEvent(title, creatorEmail);
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
