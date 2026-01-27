import { CalendarEvent } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const EVENT_PREFIX = 'event:';

export async function createEvent(title: string, creatorName: string): Promise<CalendarEvent> {
  const newEvent: CalendarEvent = {
    id: uuidv4(),
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

  await redis.set(`${EVENT_PREFIX}${newEvent.id}`, JSON.stringify(newEvent));
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

    // Save with the updated data
    await redis.set(`${EVENT_PREFIX}${eventId}`, JSON.stringify(event));

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
