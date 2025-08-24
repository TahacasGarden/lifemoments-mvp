"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "./Toast";
import { sanitizeInput, validateMemoryContent, validateAudioFile, rateLimiter, logSecurityEvent } from "@/lib/security";

type Visibility = "private" | "family" | "link" | "public";

export default function AudioCapture({
  defaultTitle = "Voice Note",
  defaultVisibility = "private",
  onCreated,
}: {
  defaultTitle?: string;
  defaultVisibility?: Visibility;
  onCreated?: () => void;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<BlobPart[]>([]);
  const [duration, setDuration] = useState(0);
  const [title, setTitle] = useState(defaultTitle);
  const [visibility, setVisibility] = useState<Visibility>(defaultVisibility);
  const [eventDate, setEventDate] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const timerRef = useRef<number | null>(null);

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
        location.replace("/login");
        return;
      }
      setUserId(data.session.user.id);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function startRecording() {
    setError(null);
    setDuration(0);
    setChunks([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = "audio/webm";
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          setChunks((prev) => [...prev, e.data]);
        }
      };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = null;
      };

      mediaRecorder.start(200);
      setRecorder(mediaRecorder);
      setRecording(true);
      timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Microphone access failed.");
    }
  }

  function stopRecording() {
    if (!recorder) return;
    recorder.stop();
    setRecorder(null);
    setRecording(false);
  }

  async function saveAudio() {
    setError(null);
    if (!userId) {
      setError("No user session.");
      return;
    }
    if (chunks.length === 0) {
      setError("No audio to save. Record something first.");
      return;
    }

    // Rate limiting
    if (!rateLimiter.isAllowed(`audio_save_${userId}`, 5, 60000)) { // 5 saves per minute
      setError("Please wait before saving another audio. Rate limit exceeded.");
      return;
    }

    // Validate content
    const sanitizedTitle = sanitizeInput(title);
    const validation = validateMemoryContent(sanitizedTitle);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    setSaving(true);
    try {
      const blob = new Blob(chunks, { type: "audio/webm" });

      // Validate file
      const file = new File([blob], 'audio.webm', { type: 'audio/webm' });
      const fileValidation = validateAudioFile(file);
      if (!fileValidation.valid) {
        throw new Error(fileValidation.error);
      }

      logSecurityEvent('audio_save_attempt', { userId, titleLength: sanitizedTitle.length, fileSize: blob.size });

      const id = crypto.randomUUID();
      const storagePath = `${userId}/${id}.webm`;

      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(storagePath, blob, {
          contentType: "audio/webm",
          upsert: false,
        });
      if (upErr) throw upErr;

      const { data: entryRes, error: entryErr } = await supabase
        .from("entries")
        .insert({
          user_id: userId,
          title: sanitizedTitle || "Voice Note",
          visibility,
          event_date: eventDate || null,
          content: null,
          summary: null,
        })
        .select("id")
        .single();
      if (entryErr) throw entryErr;

      const entryId = entryRes.id as string;

      const { error: mediaErr } = await supabase.from("entry_media").insert({
        entry_id: entryId,
        kind: "audio",
        storage_path: storagePath,
        mime_type: "audio/webm",
        duration_seconds: duration || null,
      });
      if (mediaErr) throw mediaErr;

      // reset
      setChunks([]);
      setDuration(0);
      setTitle(defaultTitle);
      setVisibility(defaultVisibility);
      setEventDate("");

      success("Memory saved!", "Your audio memory has been successfully saved to your timeline.");
      onCreated?.();
    } catch (err: any) {
      console.error(err);
      const message = err?.message ?? "Save failed.";
      setError(message);
      showError("Save failed", message);
    } finally {
      setSaving(false);
    }
  }

  const mm = Math.floor(duration / 60).toString().padStart(2, "0");
  const ss = (duration % 60).toString().padStart(2, "0");

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_24px_rgba(0,0,0,.15)]">
      <h2 className="text-lg font-semibold">Audio Capture</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Record a voice note and attach it to a new entry.
      </p>

      <div className="mt-4 grid gap-3">
        <div className="flex items-center gap-3">
          {!recording ? (
            <button
              onClick={startRecording}
              className="rounded-full px-5 py-3 font-medium text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="rounded-full px-5 py-3 font-medium text-white bg-red-500 hover:brightness-110"
            >
              Stop
            </button>
          )}

          <div className="text-sm text-muted-foreground tabular-nums">
            {mm}:{ss}
          </div>

          <button
            onClick={saveAudio}
            disabled={chunks.length === 0 || saving}
            className="ml-auto rounded-xl px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Audio"}
          </button>
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm text-muted-foreground">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Voice Note"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
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
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
