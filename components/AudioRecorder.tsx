'use client';
import { useEffect, useRef, useState } from 'react';
import { Box, Button, HStack, Select, Text, useToast } from '@chakra-ui/react';

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<BlobPart[]>([]);
  const [visibility, setVisibility] = useState<'private'|'family'|'public'>('private');
  const toast = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!recording) return;
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      setChunks([]);
      mr.ondataavailable = e => setChunks(prev => [...prev, e.data]);
      mr.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const fd = new FormData();
        fd.append('file', blob, 'entry.webm');
        fd.append('visibility', visibility);
        const res = await fetch('/api/audio', { method: 'POST', body: fd });
        if (res.ok) {
          toast({ title: 'Audio saved & transcribed', status: 'success' });
          document.dispatchEvent(new Event('entries:refresh'));
        } else {
          const t = await res.text();
          toast({ title: 'Upload failed', description: t, status: 'error' });
        }
      };
      mr.start();
      setMediaRecorder(mr);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  const stop = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <Box bg="white" p={4} rounded="md" shadow="sm" border="1px solid" borderColor="gray.200">
      <HStack justify="space-between">
        <HStack>
          {!recording
            ? <Button colorScheme="blue" onClick={()=>setRecording(true)}>Start Recording</Button>
            : <Button colorScheme="orange" onClick={stop}>Stop</Button>}
          <Select value={visibility} onChange={(e)=>setVisibility(e.target.value as any)}>
            <option value="private">Private</option>
            <option value="family">Family</option>
            <option value="public">Public</option>
          </Select>
        </HStack>
        <Text color="gray.600">{recording ? 'Recording...' : 'Not recording'}</Text>
      </HStack>
    </Box>
  );
}
