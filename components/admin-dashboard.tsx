"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Download, LogIn, RefreshCw, Save } from "lucide-react";
import type { Inquiry, InquiryStatus } from "@/lib/types";

const statuses: InquiryStatus[] = [
  "Reserved - Payment Pending",
  "Confirmed",
  "Waitlisted",
  "Cancelled"
];

type Copy = {
  login: string;
  logout: string;
  inquiries: string;
  status: string;
};

type InquiryGroup = {
  id: string;
  label: string;
  kind: "class" | "event";
  rows: Inquiry[];
};

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function safeFilePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function AdminDashboard({
  copy,
  schema,
  classLabels,
  eventLabels
}: {
  copy: Copy;
  schema: Record<string, string[]>;
  classLabels: Record<string, string>;
  eventLabels: Record<string, string>;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [error, setError] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const loadInquiries = useCallback(async function loadInquiries() {
    const response = await fetch("/api/inquiries");
    if (response.ok) {
      const body = await response.json();
      setInquiries(body.inquiries);
    }
  }, []);

  const checkSession = useCallback(async function checkSession() {
    const response = await fetch("/api/admin/session");
    const body = await response.json();
    setAuthenticated(body.authenticated);
    if (body.authenticated) loadInquiries();
  }, [loadInquiries]);

  async function login() {
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (!response.ok) {
      setError("Invalid password");
      return;
    }
    setAuthenticated(true);
    loadInquiries();
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setInquiries([]);
  }

  async function updateStatus(id: string, status: InquiryStatus) {
    const response = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (response.ok) loadInquiries();
  }

  function downloadGroup(group: InquiryGroup) {
    const headers = [
      "createdAt",
      "type",
      "group",
      "studentName",
      "age",
      "guardianName",
      "email",
      "phone",
      "preferredLanguage",
      "preferredSchedule",
      "experience",
      "status",
      "classId",
      "eventId",
      "bookingAction",
      "ticketLinksShownAt",
      "message"
    ];
    const rows = group.rows.map((item) => [
      item.createdAt,
      group.kind,
      group.label,
      item.studentName,
      item.age,
      item.guardianName,
      item.email,
      item.phone,
      item.preferredLanguage,
      item.preferredSchedule,
      item.experience,
      item.status,
      item.classId,
      item.eventId,
      item.bookingAction,
      item.ticketLinksShownAt,
      item.message
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${group.kind}-${safeFilePart(group.label || group.id)}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function groupKey(group: InquiryGroup) {
    return `${group.kind}-${group.id}`;
  }

  function toggleGroup(group: InquiryGroup) {
    const key = groupKey(group);
    setCollapsedGroups((current) => ({
      ...current,
      [key]: !(current[key] ?? true)
    }));
  }

  function renderInquiryTable(group: InquiryGroup) {
    const emptyText =
      group.kind === "event" ? "No ticket requests for this event yet." : "No reservations for this class yet.";
    const key = groupKey(group);
    const collapsed = collapsedGroups[key] ?? true;

    return (
      <section
        key={key}
        className="grid gap-3"
        aria-label={`${group.kind}: ${group.label}`}
      >
        <div className="flex flex-wrap items-end justify-between gap-2">
          <button
            type="button"
            onClick={() => toggleGroup(group)}
            aria-expanded={!collapsed}
            aria-controls={`${key}-table`}
            className="focus-ring flex min-w-0 items-start gap-2 rounded-md py-1 pr-2 text-left"
          >
            <span className="mt-7 text-black/55" aria-hidden="true">
              {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
            </span>
            <span className="min-w-0">
              <span className={`block text-xs font-semibold uppercase ${group.kind === "event" ? "text-gold" : "text-jade"}`}>
                {group.kind === "event" ? "Event" : "Class"}
              </span>
              <span className="block text-xl font-bold">{group.label}</span>
            </span>
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-black/[0.04] px-3 py-1 text-sm font-semibold text-black/65">
              {group.rows.length} {group.rows.length === 1 ? "record" : "records"}
            </span>
            {group.rows.length ? (
              <button
                type="button"
                onClick={() => downloadGroup(group)}
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-black/15 bg-white px-3 py-1 text-sm font-semibold"
              >
                <Download size={15} /> CSV
              </button>
            ) : null}
          </div>
        </div>

        <div
          id={`${key}-table`}
          hidden={collapsed}
          className="overflow-x-auto rounded-lg border border-black/10 bg-white"
        >
          <table className="min-w-full text-left text-sm">
            <thead className="bg-black/[0.04] text-xs uppercase text-black/60">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Request</th>
                <th className="px-4 py-3">{copy.status}</th>
              </tr>
            </thead>
            <tbody>
              {group.rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-black/60">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                group.rows.map((item) => (
                  <tr key={item.id} className="border-t border-black/10">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{item.studentName}</div>
                      <div className="text-black/55">Age {item.age}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{item.email}</div>
                      <div className="text-black/55">{item.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">
                        {item.inquiryType === "event" ? "Ticket request" : "Class enrollment"}
                      </div>
                      {item.bookingAction ? (
                        <div className="text-black/55">{item.bookingAction}</div>
                      ) : null}
                      {item.preferredSchedule ? (
                        <div className="text-black/55">Preferred: {item.preferredSchedule}</div>
                      ) : null}
                      {item.message ? <div className="mt-1 max-w-sm text-black/65">{item.message}</div> : null}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(event) => updateStatus(item.id, event.target.value as InquiryStatus)}
                          className="focus-ring rounded-md border border-black/15 bg-white px-2 py-2"
                          title="Update inquiry status"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <Save size={16} className="text-jade" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!authenticated) {
    return (
      <div className="mt-8 max-w-md rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <label className="grid gap-2 text-sm font-semibold">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="focus-ring rounded-md border border-black/15 px-3 py-3"
          />
        </label>
        <button
          type="button"
          onClick={login}
          className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 font-semibold text-white"
        >
          <LogIn size={18} /> {copy.login}
        </button>
        {error ? <p className="mt-3 font-semibold text-vermilion">{error}</p> : null}
      </div>
    );
  }

  const classGroups: InquiryGroup[] = Object.entries(classLabels).map(([id, label]) => ({
    id,
    label,
    kind: "class",
    rows: inquiries.filter((item) => item.inquiryType !== "event" && item.classId === id)
  }));
  const eventGroups: InquiryGroup[] = Object.entries(eventLabels).map(([id, label]) => ({
    id,
    label,
    kind: "event",
    rows: inquiries.filter((item) => item.inquiryType === "event" && item.eventId === id)
  }));
  const unknownClassRows = inquiries.filter(
    (item) => item.inquiryType !== "event" && !classLabels[item.classId]
  );
  const unknownEventRows = inquiries.filter(
    (item) => item.inquiryType === "event" && !eventLabels[item.eventId || ""]
  );
  const visibleClassGroups = classGroups.filter((group) => group.rows.length > 0);
  const visibleEventGroups = eventGroups.filter((group) => group.rows.length > 0);
  const fallbackGroups: InquiryGroup[] = [
    ...(unknownClassRows.length
      ? [{ id: "unknown-classes", label: "Other class reservations", kind: "class" as const, rows: unknownClassRows }]
      : []),
    ...(unknownEventRows.length
      ? [{ id: "unknown-events", label: "Other event requests", kind: "event" as const, rows: unknownEventRows }]
      : [])
  ];

  return (
    <div className="mt-8 grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">{copy.inquiries}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadInquiries}
            className="focus-ring inline-flex items-center gap-2 rounded-md border border-black/15 bg-white px-4 py-2 font-semibold"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            type="button"
            onClick={logout}
            className="focus-ring rounded-md bg-ink px-4 py-2 font-semibold text-white"
          >
            {copy.logout}
          </button>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-white px-4 py-6 text-black/60">
          No reservations yet.
        </div>
      ) : (
        <>
          <section className="grid gap-4">
            <h2 className="text-2xl font-bold">Class reservations</h2>
            {visibleClassGroups.length ? (
              visibleClassGroups.map(renderInquiryTable)
            ) : (
              <div className="rounded-lg border border-black/10 bg-white px-4 py-6 text-black/60">
                No class reservations yet.
              </div>
            )}
          </section>

          <section className="grid gap-4">
            <h2 className="text-2xl font-bold">Event ticket requests</h2>
            {visibleEventGroups.length ? (
              visibleEventGroups.map(renderInquiryTable)
            ) : (
              <div className="rounded-lg border border-black/10 bg-white px-4 py-6 text-black/60">
                No event ticket requests yet.
              </div>
            )}
          </section>

          {fallbackGroups.map(renderInquiryTable)}
        </>
      )}

      <section>
        <h2 className="text-2xl font-bold">Google Sheets schema</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Object.entries(schema).map(([sheet, columns]) => (
            <article key={sheet} className="rounded-lg border border-black/10 bg-white p-4">
              <h3 className="font-bold">{sheet}</h3>
              <p className="mt-2 break-words text-sm leading-7 text-black/65">
                {columns.join(", ")}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
