import { NextResponse } from 'next/server';
import { getEventCount } from '@/lib/storage';

export async function GET() {
  try {
    const count = await getEventCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error getting event count:', error);
    return NextResponse.json({ count: 0 });
  }
}
