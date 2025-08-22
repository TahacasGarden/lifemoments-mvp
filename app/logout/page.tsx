"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      await supabase.auth.signOut();
      // send them to login (or home)
      window.location.replace("/login");
    })();
  }, []);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <p className="text-sm text-muted-foreground">Signing you out…</p>
    </main>
  );
}
