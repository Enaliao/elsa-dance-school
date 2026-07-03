import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import type { Inquiry, InquiryStatus, Locale } from "./types";

const dataDir = path.join(process.cwd(), "data");
const inquiriesPath = path.join(dataDir, "inquiries.json");
export const CLASS_CAPACITY = 30;

const inquirySchema = z.object({
  inquiryType: z.enum(["class", "event"]).default("class"),
  classId: z.string().min(1),
  eventId: z.string().optional(),
  bookingAction: z.string().optional(),
  ticketLinksShownAt: z.string().optional(),
  studentName: z.string().min(2),
  age: z.coerce.number().int().min(3).max(99),
  guardianName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(7),
  preferredLanguage: z.enum(["en", "fr", "zh"]),
  preferredSchedule: z.string().optional(),
  experience: z.string().min(1),
  message: z.string().optional()
});

export type InquiryInput = z.infer<typeof inquirySchema>;

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(inquiriesPath);
  } catch {
    await fs.writeFile(inquiriesPath, "[]", "utf8");
  }
}

export async function readInquiries(): Promise<Inquiry[]> {
  await ensureStore();
  const raw = await fs.readFile(inquiriesPath, "utf8");
  return JSON.parse(raw) as Inquiry[];
}

async function writeInquiries(inquiries: Inquiry[]) {
  await ensureStore();
  await fs.writeFile(inquiriesPath, JSON.stringify(inquiries, null, 2), "utf8");
}

export async function createInquiry(payload: unknown): Promise<Inquiry> {
  const input = inquirySchema.parse(payload);
  const inquiries = await readInquiries();
  const isEventInquiry = input.inquiryType === "event";
  const reserved = isEventInquiry ? 0 : activeClassReservationCount(input.classId, inquiries);
  const status: InquiryStatus =
    !isEventInquiry && reserved >= CLASS_CAPACITY ? "Waitlisted" : "Reserved - Payment Pending";

  const inquiry: Inquiry = {
    id: `inq_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    status,
    inquiryType: input.inquiryType,
    classId: input.classId,
    eventId: input.eventId,
    bookingAction: input.bookingAction,
    ticketLinksShownAt: input.ticketLinksShownAt,
    studentName: input.studentName,
    age: input.age,
    guardianName: input.guardianName,
    email: input.email,
    phone: input.phone,
    preferredLanguage: input.preferredLanguage as Locale,
    preferredSchedule: input.preferredSchedule,
    experience: input.experience,
    message: input.message
  };

  await writeInquiries([inquiry, ...inquiries]);
  return inquiry;
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const inquiries = await readInquiries();
  const next = inquiries.map((item) => (item.id === id ? { ...item, status } : item));
  await writeInquiries(next);
  return next.find((item) => item.id === id);
}

export function classAvailability(classId: string, inquiries: Inquiry[] = []) {
  const reserved = activeClassReservationCount(classId, inquiries);
  return {
    capacity: CLASS_CAPACITY,
    reserved,
    available: Math.max(CLASS_CAPACITY - reserved, 0)
  };
}

function activeClassReservationCount(classId: string, inquiries: Inquiry[] = []) {
  return inquiries.filter(
    (item) =>
      item.inquiryType !== "event" &&
      item.classId === classId &&
      item.status !== "Cancelled" &&
      item.status !== "Waitlisted"
  ).length;
}
