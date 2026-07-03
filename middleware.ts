import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const localHosts = new Set(["localhost", "[::1]", "::1"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const hostname = host ? new URL(`http://${host}`).hostname.toLowerCase() : null;

  if (hostname && localHosts.has(hostname)) {
    const parsedHost = new URL(`http://${host}`);
    const port = parsedHost.port ? `:${parsedHost.port}` : "";
    const destination = `${request.nextUrl.protocol}//127.0.0.1${port}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(destination);
  }

  return NextResponse.next();
}
