import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Middleware to protect routes based on authentication and role.
 *
 * We read the Supabase access token from cookies directly (the cookie is
 * named `sb-<project-ref>-auth-token` by default).  This avoids importing
 * the deprecated auth-helpers middleware client which doesn't support
 * Next.js 16+.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ---- 1. Check if this route is protected ----
  const protectedPrefixes = ["/admin", "/dashboard", "/mentor"];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // ---- 2. Extract Supabase session from cookies ----
  const DEFAULT_SUPABASE_URL = "https://hsdgkcsxuxefguvqufye.supabase.co";
  const DEFAULT_SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzZGdrY3N4dXhlZmd1dnF1ZnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0Njg3MTMsImV4cCI6MjEwMTA0NDcxM30.Z0MCrqr4dosR3Q7_QEWEW6d55kEuTY6qNNXiYVSGh34";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  // Supabase stores the session in a cookie whose name contains the project ref
  const projectRef = supabaseUrl.replace("https://", "").split(".")[0];
  const authCookieName = `sb-${projectRef}-auth-token`;
  const tokenCookie = request.cookies.get(authCookieName);

  if (!tokenCookie?.value) {
    // No session cookie — redirect to login
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Parse the token to get the access token
  let accessToken: string | undefined;
  try {
    const parsed = JSON.parse(tokenCookie.value);
    accessToken = Array.isArray(parsed) ? parsed[0] : parsed.access_token;
  } catch {
    accessToken = tokenCookie.value;
  }

  if (!accessToken) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Create a temporary Supabase client to verify the token
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ---- 3. Role-based protection ----
  const role = (user.app_metadata?.role as string) ?? "";
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/?unauthorized=true", request.url));
  }
  if (pathname.startsWith("/mentor") && role !== "mentor") {
    return NextResponse.redirect(new URL("/?unauthorized=true", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/mentor/:path*"],
};
