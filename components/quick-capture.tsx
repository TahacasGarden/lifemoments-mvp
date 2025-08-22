"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Visibility = "private" | "family" | "link" | "public";

export default function QuickCapture({
  onCreated,
}: {
  onCreated?: () => void; // optional callback after a successful insert
}) {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topicsInput, setTopicsInput] = useState(""); // comma-separated
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [eventDate, setEventDate] = useState<string>(""); // YYYY-MM-DD

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) {
        setError(error.message);
        return;
      }
      if (!data.session) {
        // not signed in → go to /login
        location.replace("/login");
        return;
      }
      setUserId(data.session.user.id);
      setReady(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) location.replace("/login");
    });
    return () => {
      sub.subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  const topicsArray = useMemo(
    () =>
      topicsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [topicsInput]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);

    if (!userId) {
      setError("No user session.");
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("entries").insert({
      user_id: userId,
      title: title.trim(),
      content: content.trim() || null,
      topics: topicsArray.length ? topicsArray : null,
      visibility,
      event_date: eventDate ? eventDate : null,
    });
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setOk("Saved!");
    setTitle("");
    setContent("");
    setTopicsInput("");
    setVisibility("private");
    setEventDate("");

    onCreated?.();
  }

  if (!ready) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="text-sm text-muted-foreground">Loading capture…</div>
      </div>
    );
  }

  return (
    <form
      id="quick-capture"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_24px_rgba(0,0,0,.15)]"
    >
      <h2 className="text-lg font-semibold">Quick Capture</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Save a memory with title, text, topics, visibility, and optional date.
      </p>

      <div className="mt-4 grid gap-3">
        <div className="grid gap-1.5">
          <label className="text-sm text-muted-foreground">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a short, clear title"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm text-muted-foreground">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the story or lesson here…"
            className="min-h-[120px] w-full resize-y rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm text-muted-foreground">
            Topics (comma separated)
          </label>
          <input
            type="text"
            value={topicsInput}
            onChange={(e) => setTopicsInput(e.target.value)}
            placeholder="family, advice, career"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
          {topicsArray.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {topicsArray.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="grid gap-1.5">
            <label className="text-sm text-muted-foreground">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as Visibility)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="private">Private</option>
              <option value="family">Family</option>
              <option value="link">Link</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="grid gap-1.5 md:col-span-2">
            <label className="text-sm text-muted-foreground">Event date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use today (timeline sorts by this date).
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
            {error}
          </div>
        )}
        {ok && (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
            {ok}
          </div>
        )}

        <div className="mt-2 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl px-5 py-3 font-medium text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Entry"}
          </button>
        </div>
      </div>
    </form>
  );
}
