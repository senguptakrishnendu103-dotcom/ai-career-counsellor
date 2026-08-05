import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { Database } from "@/types/supabase"; // optional, placeholder for DB types

/**
 * API route for fetching and updating user profile data.
 * Supports GET (fetch) and PUT (update) methods.
 */
export async function GET(request: Request) {
  const response = NextResponse.next();
  const supabase = createRouteHandlerClient({ request, response });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const response = NextResponse.next();
  const supabase = createRouteHandlerClient({ request, response });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const body = await request.json();
  const { error } = await supabase.from("profiles").upsert({
    id: session.user.id,
    ...body,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
