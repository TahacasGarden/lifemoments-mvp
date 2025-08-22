"use client";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) location.replace("/dashboard");
    })();
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/dashboard` },
    });
  }

  async function signInWithEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else location.replace("/dashboard");
  }

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use Google or email / password.
        </p>

        <button
          onClick={signInWithGoogle}
          className="mt-4 w-full rounded-xl px-4 py-3 font-medium text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110"
        >
          Continue with Google
        </button>

        <form onSubmit={signInWithEmail} className="mt-4 grid gap-3">
          <div className="grid gap-1.5">
            <label className="text-sm text-muted-foreground">Email</label>
            <input name="email" type="email" required className="w-full rounded-xl border border-border bg-background px-3 py-2" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm text-muted-foreground">Password</label>
            <input name="password" type="password" required className="w-full rounded-xl border border-border bg-background px-3 py-2" />
          </div>
          <button className="mt-1 rounded-xl px-4 py-3 font-medium text-white bg-primary">Sign in</button>
        </form>
      </div>
    </main>
  );
}
