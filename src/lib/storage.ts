import { CalendarEvent } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const EVENT_PREFIX = 'event:';

export async function createEvent(title: string, creatorEmail: string): Promise<CalendarEvent> {
  const newEvent: CalendarEvent = {
    id: uuidv4(),
    title,
    creatorEmail,
    participants: [{
      id: uuidv4(),
      email: creatorEmail,
      selectedDates: [],
      isCreator: true,
    }],
    invitedEmails: [],
    createdAt: new Date().toISOString(),
  };

  await redis.set(`${EVENT_PREFIX}${newEvent.id}`, JSON.stringify(newEvent));
  return newEvent;
}

export async function getEvent(id: string): Promise<CalendarEvent | null> {
  const data = await redis.get<string>(`${EVENT_PREFIX}${id}`);
  if (!data) return null;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function updateEventTitle(
  id: string,
  title: string,
  requestorEmail: string
): Promise<CalendarEvent | null> {
  const event = await getEvent(id);
  if (!event) return null;
  if (event.creatorEmail !== requestorEmail) return null;

  event.title = title;
  await redis.set(`${EVENT_PREFIX}${id}`, JSON.stringify(event));
  return event;
}

export async function addParticipant(
  eventId: string,
  email: string
): Promise<CalendarEvent | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  const existingParticipant = event.participants.find(p => p.email === email);

  if (!existingParticipant) {
    event.participants.push({
      id: uuidv4(),
      email,
      selectedDates: [],
      isCreator: false,
    });
    await redis.set(`${EVENT_PREFIX}${eventId}`, JSON.stringify(event));
  }

  return event;
}

export async function updateParticipantDates(
  eventId: string,
  email: string,
  dates: string[]
): Promise<CalendarEvent | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  let participant = event.participants.find(p => p.email === email);

  if (!participant) {
    participant = {
      id: uuidv4(),
      email,
      selectedDates: dates,
      isCreator: false,
    };
    event.participants.push(participant);
  } else {
    participant.selectedDates = dates;
  }

  await redis.set(`${EVENT_PREFIX}${eventId}`, JSON.stringify(event));
  return event;
}

export async function addInvitedEmail(
  eventId: string,
  email: string
): Promise<CalendarEvent | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  if (!event.invitedEmails.includes(email)) {
    event.invitedEmails.push(email);
    await redis.set(`${EVENT_PREFIX}${eventId}`, JSON.stringify(event));
  }

  return event;
}

export function getMatchingDates(event: CalendarEvent): string[] {
  if (event.participants.length < 2) return [];

  const dateCounts: Record<string, number> = {};

  event.participants.forEach(participant => {
    participant.selectedDates.forEach(date => {
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
  });

  return Object.entries(dateCounts)
    .filter(([, count]) => count >= 2)
    .map(([date]) => date)
    .sort();
}
