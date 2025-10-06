// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Add any custom middleware logic here
  return res;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};
