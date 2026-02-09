import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const signedIn = req.cookies.get("isSignedIn")?.value;
  const userId = req.cookies.get("userId")?.value;

  if (signedIn !== "1" || !userId) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/game/:path*"],
};
