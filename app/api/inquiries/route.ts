import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createInquiry, readInquiries } from "@/lib/storage";

export async function GET() {
  const store = await cookies();
  if (store.get("elsa_admin")?.value !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const inquiries = await readInquiries();
  return NextResponse.json({ inquiries });
}

export async function POST(request: Request) {
  try {
    const inquiry = await createInquiry(await request.json());
    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid reservation" },
      { status: 400 }
    );
  }
}
