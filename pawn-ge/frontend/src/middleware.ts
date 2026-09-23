import { NextRequest, NextResponse } from "next/server";

/**
 * Early route rejection for protected areas (UX layer only — the Spring
 * Security backend remains the authoritative authorization boundary).
 *
 * Uses the httpOnly session cookie mirrored at login. The JWT is only
 * decoded here for role hints; never trust this for security decisions.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("pawn_access_token")?.value;
  const role = decodeRole(token);

  const isSuperAdminRoute = pathname.startsWith("/super-admin");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!token || !role) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (isSuperAdminRoute && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAdminRoute && role === "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/super-admin/applications", req.url));
  }

  if (isAdminRoute && role !== "LOMBARD_ADMIN" && role !== "LOMBARD_EMPLOYEE") {
    // CUSTOMER must not reach /admin even by typing the URL.
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

function decodeRole(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return json.role ?? null;
  } catch {
    return null;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/super-admin/:path*"],
};
