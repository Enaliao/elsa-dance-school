export type Locale = "en" | "fr" | "zh";

export type Translation = Record<Locale, string>;

export type ProgramId =
  | "chinese-dance"
  | "contemporary"
  | "k-pop"
  | "private-lessons"
  | "summer-camp";

export type AgeGroup = "kids" | "teens" | "adults" | "mixed" | "private";

export type ClassOption = {
  id: string;
  programId: ProgramId;
  title: Translation;
  ageGroup: AgeGroup;
  level: Translation;
  schedule: Translation;
  capacity: number;
  reserved: number;
};

export type EventItem = {
  id: string;
  title: Translation;
  date: string;
  location: Translation;
  summary: Translation;
  type: "gala" | "competition" | "community";
};

export type MediaItem = {
  id: string;
  title: Translation;
  kind: "photo" | "video";
  eventId?: string;
  src: string;
  thumbnail?: string;
};

export type InquiryStatus =
  | "Reserved - Payment Pending"
  | "Confirmed"
  | "Waitlisted"
  | "Cancelled";

export type Inquiry = {
  id: string;
  createdAt: string;
  status: InquiryStatus;
  inquiryType?: "class" | "event";
  classId: string;
  eventId?: string;
  bookingAction?: string;
  ticketLinksShownAt?: string;
  studentName: string;
  age: number;
  guardianName?: string;
  email: string;
  phone: string;
  preferredLanguage: Locale;
  preferredSchedule?: string;
  experience: string;
  message?: string;
};
