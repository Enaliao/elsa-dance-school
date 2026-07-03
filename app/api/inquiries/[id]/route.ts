import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateInquiryStatus } from "@/lib/storage";
import type { InquiryStatus } from "@/lib/types";

const statuses: InquiryStatus[] = [
  "Reserved - Payment Pending",
  "Confirmed",
  "Waitlisted",
  "Cancelled"
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const store = await cookies();
  if (store.get("elsa_admin")?.value !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: { status?: InquiryStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const status = body.status;
  if (!status || !statuses.includes(status)) {
    return NextResponse.json({ error: "Unsupported status" }, { status: 400 });
  }
  const inquiry = await updateInquiryStatus(id, status);
  if (!inquiry) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }
  return NextResponse.json({ inquiry });
}
