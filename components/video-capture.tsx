"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Visibility = "private" | "family" | "link" | "public";

export default function VideoCapture({ onCreated }: { onCreated?: () => void }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<BlobPart[]>([]);
  const [recording, setRecording] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [title, setTitle] = useState("Video Note");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) location.replace("/login");
      else setUserId(data.session.user.id);
    })();
  }, []);

  async function start() {
    setChunks([]);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
    const r = new MediaRecorder(stream, { mimeType: "video/webm" });
    r.ondataavailable = (e) => e.data.size && setChunks((c) => [...c, e.data]);
    r.onstop = () => stream.getTracks().forEach((t) => t.stop());
    r.start(200);
    setRec(r);
    setRecording(true);
  }

  function stop() {
    rec?.stop();
    setRec(null);
    setRecording(false);
  }

  async function save() {
    if (!userId || chunks.length === 0) return;
    const blob = new Blob(chunks, { type: "video/webm" });
    const id = crypto.randomUUID();
    const storagePath = `${userId}/${id}.webm`;

    const up = await supabase.storage.from("media").upload(storagePath, blob, {
      contentType: "video/webm",
    });
    if (up.error) return alert(up.error.message);

    const entry = await supabase.from("entries")
      .insert({ user_id: userId, title, visibility })
      .select("id")
      .single();
    if (entry.error) return alert(entry.error.message);

    const media = await supabase.from("entry_media")
      .insert({ entry_id: entry.data.id, kind: "video", storage_path: storagePath, mime_type: "video/webm" });
    if (media.error) return alert(media.error.message);

    setChunks([]);
    setTitle("Video Note");
    onCreated?.();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_24px_rgba(0,0,0,.15)]">
      <h2 className="text-lg font-semibold">Video Capture</h2>
      <div className="mt-3 grid gap-3">
        <video ref={videoRef} autoPlay muted className="w-full rounded-xl border border-border bg-background" />
        <div className="flex gap-3">
          {!recording ? (
            <button onClick={start} className="rounded-xl px-4 py-2 bg-primary text-white">Start</button>
          ) : (
            <button onClick={stop} className="rounded-xl px-4 py-2 bg-red-500 text-white">Stop</button>
          )}
          <button disabled={!chunks.length} onClick={save} className="rounded-xl px-4 py-2 bg-emerald-600 text-white disabled:opacity-60">
            Save Video
          </button>
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm text-muted-foreground">Title</label>
          <input className="rounded-xl border border-border bg-background px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm text-muted-foreground">Visibility</label>
          <select className="rounded-xl border border-border bg-background px-3 py-2" value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
            <option value="private">Private</option>
            <option value="family">Family</option>
            <option value="link">Link</option>
            <option value="public">Public</option>
          </select>
        </div>
      </div>
    </div>
  );
}
