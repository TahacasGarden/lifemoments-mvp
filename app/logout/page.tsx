"use client";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    supabase.auth.signOut().then(() => location.replace("/"));
  }, []);
  return <main className="p-6">Signing out…</main>;
}
