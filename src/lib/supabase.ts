import { createClient, SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://hsdgkcsxuxefguvqufye.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzZGdrY3N4dXhlZmd1dnF1ZnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0Njg3MTMsImV4cCI6MjEwMTA0NDcxM30.Z0MCrqr4dosR3Q7_QEWEW6d55kEuTY6qNNXiYVSGh34";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);
