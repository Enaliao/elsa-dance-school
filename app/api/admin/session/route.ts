import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const store = await cookies();
  return NextResponse.json({ authenticated: store.get("elsa_admin")?.value === "ok" });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("elsa_admin");
  return response;
}
