"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Entry = {
  id: string;
  user_id: string;
  title: string | null;
  content: string | null;
  summary: string | null;
  topics: string[] | null;
  visibility: "private" | "family" | "link" | "public";
  event_date: string | null;
  created_at: string;
  updated_at: string;
};

type MediaRow = {
  id: string;
  entry_id: string;
  kind: "audio" | "video" | "image" | "file";
  storage_path: string;
  mime_type: string | null;
  duration_seconds: number | null;
  created_at: string;
};

export default function EntryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fmt = useMemo(
    () => new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }),
    []
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      // ensure session
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        router.replace("/login");
        return;
      }

      // load entry
      const { data: e, error: eErr } = await supabase
        .from("entries")
        .select("*")
        .eq("id", params.id)
        .single();

      if (eErr) {
        setErr(eErr.message);
        setLoading(false);
        return;
      }
      if (!mounted) return;
      setEntry(e as Entry);

      // load media
      const { data: m, error: mErr } = await supabase
        .from("entry_media")
        .select("*")
        .eq("entry_id", params.id)
        .order("created_at", { ascending: true });

      if (mErr) {
        setErr(mErr.message);
        setLoading(false);
        return;
      }
      if (!mounted) return;
      setMedia((m ?? []) as MediaRow[]);

      // fetch signed URLs for audio/video so we can play
      const audioRows = (m ?? []).filter((row) => row.kind === "audio");
      const urlMap: Record<string, string> = {};
      for (const row of audioRows) {
        const { data: signed, error: sErr } = await supabase.storage
          .from("media")
          .createSignedUrl(row.storage_path, 60 * 60); // 1 hour
        if (!sErr && signed?.signedUrl) {
          urlMap[row.id] = signed.signedUrl;
        }
      }
      if (!mounted) return;
      setAudioUrls(urlMap);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [params.id, router]);

  if (loading) {
    return <main className="min-h-[60vh] grid place-items-center p-6">Loading…</main>;
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
  if (!entry) {
    return <main className="p-6">Not found.</main>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur px-6 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-lg border px-3 py-2 text-sm hover:bg-muted">
          ← Back
        </button>
        <h1 className="text-xl font-semibold">{entry.title || "Untitled"}</h1>
        <div className="ml-auto text-xs text-muted-foreground">
          {entry.event_date ? fmt.format(new Date(entry.event_date)) : fmt.format(new Date(entry.created_at))}
        </div>
      </div>

      <section className="container mx-auto px-6 py-6 space-y-6">
        {entry.content && (
          <article className="rounded-2xl border border-border bg-card p-6">
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{entry.content}</p>
          </article>
        )}

        {media.length > 0 && (
          <div className="grid gap-4">
            {media.map((m) => {
              if (m.kind === "audio") {
                const src = audioUrls[m.id];
                return (
                  <div key={m.id} className="rounded-2xl border border-border bg-card p-6">
                    <div className="text-sm font-medium mb-2">Audio</div>
                    {src ? (
                      <audio controls src={src} className="w-full" />
                    ) : (
                      <div className="text-sm text-muted-foreground">Loading audio…</div>
                    )}
                    {m.duration_seconds ? (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Duration: {Math.floor(m.duration_seconds / 60)}:{(m.duration_seconds % 60).toString().padStart(2, "0")}
                      </div>
                    ) : null}
                  </div>
                );
              }
              // TODO: video/image handling later
              return (
                <div key={m.id} className="rounded-2xl border border-border bg-card p-6">
                  <div className="text-sm text-muted-foreground">Media: {m.kind}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
