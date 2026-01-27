export interface Participant {
  id: string;
  email: string;
  name?: string;
  selectedDates: string[]; // ISO date strings
  isCreator: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  creatorEmail: string;
  participants: Participant[];
  invitedEmails: string[];
  createdAt: string;
}
