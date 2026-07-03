"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";
import { dictionary, t } from "@/lib/i18n";
import type { ClassOption, EventItem, Locale } from "@/lib/types";

type TicketLink = {
  label: string;
  href: string;
};

const privateCoachingSlots = [
  { value: "wednesday-12-13", label: "Wednesday 12:00-13:00" },
  { value: "wednesday-13-14", label: "Wednesday 13:00-14:00" },
  { value: "wednesday-14-15", label: "Wednesday 14:00-15:00" },
  { value: "wednesday-15-16", label: "Wednesday 15:00-16:00" },
  { value: "wednesday-16-17", label: "Wednesday 16:00-17:00" },
  { value: "wednesday-17-18", label: "Wednesday 17:00-18:00" }
];

const summerCampWeeks = [
  { value: "july-6-10", label: "July 6-10, 2026" },
  { value: "july-13-17", label: "July 13-17, 2026" },
  { value: "july-20-24", label: "July 20-24, 2026" },
  { value: "july-27-31", label: "July 27-31, 2026" },
  { value: "august-3-7", label: "August 3-7, 2026" },
  { value: "august-10-14", label: "August 10-14, 2026" },
  { value: "august-17-21", label: "August 17-21, 2026" },
  { value: "august-24-28", label: "August 24-28, 2026" }
];

export function ReservationForm({
  locale,
  classes,
  events,
  initialClassId,
  initialEventId,
  ticketLinks
}: {
  locale: Locale;
  classes: ClassOption[];
  events: EventItem[];
  initialClassId?: string;
  initialEventId?: string;
  ticketLinks: TicketLink[];
}) {
  const copy = dictionary[locale];
  const fallbackClassId = classes[0]?.id || "";
  const selectedClassId = classes.some((item) => item.id === initialClassId)
    ? initialClassId
    : fallbackClassId;
  const selectedEvent = events.find((item) => item.id === initialEventId);
  const [selectedClassIdValue, setSelectedClassIdValue] = useState(selectedClassId);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [showTickets, setShowTickets] = useState(false);
  const isPrivateCoaching = !selectedEvent && selectedClassIdValue === "private-coaching";
  const isSummerCamp = !selectedEvent && selectedClassIdValue === "summer-camp-2026";
  const scheduleOptions = isPrivateCoaching ? privateCoachingSlots : isSummerCamp ? summerCampWeeks : [];

  async function submit(formData: FormData) {
    setStatus("saving");
    setMessage("");
    setShowTickets(false);
    const payload = {
      ...Object.fromEntries(formData.entries()),
      ...(selectedEvent
        ? {
            bookingAction: "ticket-links-shown",
            ticketLinksShownAt: new Date().toISOString()
          }
        : {})
    };
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      setStatus("error");
      setMessage("Please check the form and try again.");
      return;
    }
    const body = await response.json();
    setStatus("success");
    setMessage(body.inquiry?.status === "Waitlisted" ? "Class is full. You have been added to the waiting list." : copy.success);
    if (selectedEvent) setShowTickets(true);
  }

  return (
    <>
      <form action={submit} className="grid gap-4 rounded-lg border border-black/10 bg-paper p-5 shadow-sm">
        {selectedEvent ? (
          <div className="rounded-md border border-gold/25 bg-gold/10 p-4">
            <p className="text-sm font-semibold text-gold">Event ticket request</p>
            <h3 className="mt-1 text-xl font-bold">{t(selectedEvent.title, locale)}</h3>
            <p className="mt-1 text-sm text-black/70">
              {selectedEvent.date} | {t(selectedEvent.location, locale)}
            </p>
            <input type="hidden" name="inquiryType" value="event" />
            <input type="hidden" name="eventId" value={selectedEvent.id} />
            <input type="hidden" name="classId" value={`event:${selectedEvent.id}`} />
          </div>
        ) : (
          <>
            <input type="hidden" name="inquiryType" value="class" />
            <label className="grid gap-1 text-sm font-semibold">
              Class
              <select
                name="classId"
                required
                value={selectedClassIdValue}
                onChange={(event) => setSelectedClassIdValue(event.target.value)}
                className="focus-ring rounded-md border border-black/15 bg-white px-3 py-3"
              >
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {t(item.title, locale)} - {item.ageGroup}
                  </option>
                ))}
              </select>
            </label>
            {scheduleOptions.length ? (
              <label className="grid gap-1 text-sm font-semibold">
                {isSummerCamp ? "Camp week" : "Preferred session"}
                <select
                  name="preferredSchedule"
                  required
                  defaultValue=""
                  key={selectedClassIdValue}
                  className="focus-ring rounded-md border border-black/15 bg-white px-3 py-3"
                >
                  <option value="" disabled>
                    {isSummerCamp ? "Select a July or August week" : "Select a Wednesday afternoon session"}
                  </option>
                  {scheduleOptions.map((slot) => (
                    <option key={slot.value} value={slot.label}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </>
        )}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">
          Student name
          <input name="studentName" required className="focus-ring rounded-md border border-black/15 px-3 py-3" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Age
          <input name="age" type="number" min="3" max="99" required className="focus-ring rounded-md border border-black/15 px-3 py-3" />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-semibold">
        Parent/guardian name
        <input name="guardianName" className="focus-ring rounded-md border border-black/15 px-3 py-3" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">
          Email
          <input name="email" type="email" required className="focus-ring rounded-md border border-black/15 px-3 py-3" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Phone
          <input name="phone" required className="focus-ring rounded-md border border-black/15 px-3 py-3" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">
          Preferred language
          <select name="preferredLanguage" defaultValue={locale} className="focus-ring rounded-md border border-black/15 bg-white px-3 py-3">
            <option value="en">English</option>
            <option value="fr">Francais</option>
            <option value="zh">中文</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Experience
          <select name="experience" required className="focus-ring rounded-md border border-black/15 bg-white px-3 py-3">
            <option value="beginner">Beginner</option>
            <option value="some">Some experience</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
      </div>
      <label className="grid gap-1 text-sm font-semibold">
        Message
        <textarea name="message" rows={4} className="focus-ring rounded-md border border-black/15 px-3 py-3" />
      </label>
      <button
        type="submit"
        disabled={status === "saving"}
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-vermilion px-5 py-3 font-semibold text-white disabled:opacity-70"
      >
        <Send size={18} /> {status === "saving" ? "Saving..." : copy.submit}
      </button>
      {message ? (
        <p role="status" className={status === "error" ? "font-semibold text-vermilion" : "font-semibold text-jade"}>
          {message}
        </p>
      ) : null}
      </form>

      {showTickets ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-jade">Request recorded</p>
                <h3 className="mt-1 text-2xl font-bold">Ticket booking links</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTickets(false)}
                className="focus-ring rounded-md p-2 text-black/65 hover:bg-black/5"
                aria-label="Close ticket booking links"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              {ticketLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="focus-ring rounded-md bg-ink px-4 py-3 text-center font-semibold text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-black/65">
              Staff can see this event ticket request in the admin reservations table.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
