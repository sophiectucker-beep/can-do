export interface Participant {
  id: string;
  name: string;
  selectedDates: string[]; // ISO date strings
  isCreator: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  creatorName: string;
  participants: Participant[];
  createdAt: string;
}
