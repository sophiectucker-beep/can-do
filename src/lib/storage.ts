import { CalendarEvent } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const EVENT_PREFIX = 'event:';

// Generate a short, readable ID like "2h6jk"
function generateShortId(length: number = 5): string {
  // Use lowercase letters and numbers, excluding confusing characters (0, o, l, 1)
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate a unique short ID (check for collisions)
async function generateUniqueShortId(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const id = generateShortId();
    const exists = await redis.exists(`${EVENT_PREFIX}${id}`);
    if (!exists) {
      return id;
    }
  }
  // Fallback to longer ID if we keep getting collisions
  return generateShortId(8);
}

export async function createEvent(title: string, creatorName: string): Promise<CalendarEvent> {
  const eventId = await generateUniqueShortId();

  // Calculate expiry: 3 months from now (in seconds)
  const threeMonthsInSeconds = 90 * 24 * 60 * 60;

  const newEvent: CalendarEvent = {
    id: eventId,
    title,
    creatorName,
    participants: [{
      id: uuidv4(),
      name: creatorName,
      selectedDates: [],
      isCreator: true,
    }],
    createdAt: new Date().toISOString(),
  };

  // Store with 3 month expiry
  await redis.set(`${EVENT_PREFIX}${newEvent.id}`, JSON.stringify(newEvent), {
    ex: threeMonthsInSeconds,
  });

  return newEvent;
}

export async function getEvent(id: string): Promise<CalendarEvent | null> {
  const data = await redis.get<string>(`${EVENT_PREFIX}${id}`);
  if (!data) return null;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function updateParticipantDates(
  eventId: string,
  visitorId: string,
  name: string,
  dates: string[]
): Promise<CalendarEvent | null> {
  // Retry up to 3 times in case of concurrent updates
  for (let attempt = 0; attempt < 3; attempt++) {
    const event = await getEvent(eventId);
    if (!event) return null;

    // Find or create participant
    const existingIndex = event.participants.findIndex(p => p.id === visitorId);

    if (existingIndex >= 0) {
      // Update existing participant
      event.participants[existingIndex].name = name;
      event.participants[existingIndex].selectedDates = dates;
    } else {
      // Add new participant
      event.participants.push({
        id: visitorId,
        name,
        selectedDates: dates,
        isCreator: false,
      });
    }

    // Save with the updated data (refresh the 3 month expiry)
    const threeMonthsInSeconds = 90 * 24 * 60 * 60;
    await redis.set(`${EVENT_PREFIX}${eventId}`, JSON.stringify(event), {
      ex: threeMonthsInSeconds,
    });

    // Verify the save worked by reading back
    const verified = await getEvent(eventId);
    if (verified) {
      const savedParticipant = verified.participants.find(p => p.id === visitorId);
      if (savedParticipant &&
          savedParticipant.name === name &&
          JSON.stringify(savedParticipant.selectedDates.sort()) === JSON.stringify(dates.sort())) {
        return verified;
      }
    }

    // If verification failed, wait a bit and retry
    await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
  }

  // Final attempt - just return whatever we have
  return await getEvent(eventId);
}

export async function updateParticipantName(
  eventId: string,
  visitorId: string,
  newName: string
): Promise<CalendarEvent | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  const participant = event.participants.find(p => p.id === visitorId);
  if (!participant) return null;

  participant.name = newName;

  // If this participant is the creator, also update creatorName
  if (participant.isCreator) {
    event.creatorName = newName;
  }

  const threeMonthsInSeconds = 90 * 24 * 60 * 60;
  await redis.set(`${EVENT_PREFIX}${eventId}`, JSON.stringify(event), {
    ex: threeMonthsInSeconds,
  });

  return event;
}

export async function updateEventTitle(
  eventId: string,
  visitorId: string,
  newTitle: string
): Promise<CalendarEvent | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  // Only the creator can update the title
  const creator = event.participants.find(p => p.isCreator && p.id === visitorId);
  if (!creator) return null;

  event.title = newTitle;

  const threeMonthsInSeconds = 90 * 24 * 60 * 60;
  await redis.set(`${EVENT_PREFIX}${eventId}`, JSON.stringify(event), {
    ex: threeMonthsInSeconds,
  });

  return event;
}

export function getMatchingDates(event: CalendarEvent): string[] {
  if (event.participants.length < 2) return [];

  const dateCounts: Record<string, number> = {};
  const totalParticipants = event.participants.length;

  event.participants.forEach(participant => {
    participant.selectedDates.forEach(date => {
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
  });

  // Only return dates where ALL participants have selected
  return Object.entries(dateCounts)
    .filter(([, count]) => count === totalParticipants)
    .map(([date]) => date)
    .sort();
}

export async function getEventCount(): Promise<number> {
  try {
    // Use scan to count all keys matching the event prefix
    let count = 0;
    let cursor = 0;

    do {
      const result = await redis.scan(cursor, { match: `${EVENT_PREFIX}*`, count: 100 });
      cursor = result[0];
      count += result[1].length;
    } while (cursor !== 0);

    return count;
  } catch (error) {
    console.error('Error counting events:', error);
    return 0;
  }
}
