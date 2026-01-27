import { NextRequest, NextResponse } from 'next/server';
import { addInvitedEmail } from '@/lib/storage';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const event = await addInvitedEmail(id, email);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // In a real app, you would send an email here
    // For now, we just add the email to the invited list
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/event/${id}?email=${encodeURIComponent(email)}`;

    return NextResponse.json({
      success: true,
      shareUrl,
      message: `Share this link with ${email}: ${shareUrl}`,
    });
  } catch (error) {
    console.error('Error inviting:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}
