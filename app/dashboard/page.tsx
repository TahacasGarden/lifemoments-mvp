"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import QuickCapture from "@/components/quick-capture";
import AudioCapture from "@/components/audio-capture";

type Visibility = "private" | "family" | "link" | "public";

type TimelineRow = {
  id: string;
  user_id: string;
  title: string | null;
  summary: string | null;
  topics: string[] | null;
  visibility: Visibility;
  event_date: string | null; // YYYY-MM-DD
  created_at: string;        // ISO datetime
  updated_at: string;        // ISO datetime
  sort_date: string;         // YYYY-MM-DD
};

export default function DashboardPage() {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [rows, setRows] = useState<TimelineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    []
  );

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);

    // Gate by session
    const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
    if (sessErr) {
      setErr(sessErr.message);
      setLoading(false);
      return;
    }
    const session = sessionData.session;
    if (!session) {
      location.replace("/login");
      return;
    }
    const uid = session.user.id;
    setUserId(uid);

    // Load timeline
    const { data, error } = await supabase
      .from("v_timeline")
      .select("*")
      .eq("user_id", uid)
      .order("sort_date", { ascending: false })
      .limit(200);

    if (error) {
      setErr(error.message);
      setRows([]);
    } else {
      setRows((data ?? []) as TimelineRow[]);
    }

    setLoading(false);
    setReady(true);
  }, []);

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) location.replace("/login");
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [load]);

  if (!ready || loading) {
    return (
      <main className="min-h-[60vh] grid place-items-center p-6">
        <div className="text-sm text-muted-foreground">Loading your timeline…</div>
      </main>
    );
  }

  if (err) {
    return (
      <main className="min-h-[60vh] grid place-items-center p-6">
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
          {err}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Timeline</h1>
        <div className="flex items-center gap-3">
          <a
            href="/logout"
            className="rounded-lg border px-3 py-2 text-sm hover:bg-muted transition"
          >
            Sign out
          </a>
        </div>
      </div>

      <section className="container mx-auto px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Entries" value={rows.length} />
          <StatCard
            label="Public"
            value={rows.filter((r) => r.visibility === "public").length}
          />
          <StatCard
            label="Family"
            value={rows.filter((r) => r.visibility === "family").length}
          />
          <StatCard
            label="Private"
            value={rows.filter((r) => r.visibility === "private").length}
          />
        </div>

        {/* Capture widgets */}
        <QuickCapture onCreated={load} />
        <AudioCapture onCreated={load} />

        {/* Timeline */}
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rows.map((r) => (
              <Link key={r.id} href={`/entries/${r.id}`} className="block">
                <article className="rounded-2xl border border-border bg-card text-card-foreground p-5 shadow-[0_8px_24px_rgba(0,0,0,.15)] hover:shadow-[0_12px_28px_rgba(0,0,0,.2)] transition-shadow">
                  <header className="flex items-center justify-between gap-3">
                    <VisibilityBadge v={r.visibility} />
                    <time className="text-xs text-muted-foreground">
                      {fmt.format(new Date(r.sort_date))}
                    </time>
                  </header>

                  <h3 className="mt-3 text-[17px] font-semibold">
                    {r.title || "Untitled"}
                  </h3>

                  {r.summary ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {r.summary}
                    </p>
                  ) : null}

                  <footer className="mt-4 flex flex-wrap items-center gap-2">
                    {(r.topics ?? []).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </footer>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_8px_24px_rgba(0,0,0,.15)]">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function VisibilityBadge({ v }: { v: Visibility }) {
  const text =
    v === "public" ? "Public" : v === "family" ? "Family" : v === "link" ? "Link" : "Private";
  const tone =
    v === "public"
      ? "bg-[rgba(34,197,94,.12)] text-[rgb(34,197,94)]"
      : v === "family"
      ? "bg-[rgba(59,130,246,.12)] text-[rgb(59,130,246)]"
      : v === "link"
      ? "bg-[rgba(234,179,8,.12)] text-[rgb(234,179,8)]"
      : "bg-[rgba(148,163,184,.15)] text-[rgb(148,163,184)]";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${tone}`}>
      {text}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 grid place-items-center text-center">
      <div className="text-lg font-semibold">No entries yet</div>
      <p className="mt-2 text-sm text-muted-foreground">
        Use <span className="font-medium">Quick Capture</span> or <span className="font-medium">Audio Capture</span> to add your first memory.
      </p>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="mt-5 inline-flex rounded-xl px-5 py-3 font-medium text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110"
      >
        Add Entry
      </a>
    </div>
  );
}
