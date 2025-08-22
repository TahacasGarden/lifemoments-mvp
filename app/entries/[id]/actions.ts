"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function deleteEntry(entryId: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => cookieStore.get(n)?.value } }
  );
  const { error } = await supabase.from("entries").delete().eq("id", entryId);
  if (error) throw new Error(error.message);
}
