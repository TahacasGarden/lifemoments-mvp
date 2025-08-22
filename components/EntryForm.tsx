'use client';
import { useState } from 'react';
import { Box, Button, Select, Textarea, VStack } from '@chakra-ui/react';

export default function EntryForm() {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'private'|'family'|'public'>('private');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!content.trim()) return;
    setLoading(true);
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, media_type: 'text', visibility })
    });
    setLoading(false);
    if (res.ok) {
      setContent('');
      document.dispatchEvent(new Event('entries:refresh'));
    } else {
      alert('Save failed');
    }
  };

  return (
    <VStack align="stretch" spacing={3} bg="white" p={4} rounded="md" shadow="sm" border="1px solid" borderColor="gray.200">
      <Textarea placeholder="What did you learn today?" value={content} onChange={(e)=>setContent(e.target.value)} />
      <Select value={visibility} onChange={(e)=>setVisibility(e.target.value as any)}>
        <option value="private">Private</option>
        <option value="family">Family</option>
        <option value="public">Public</option>
      </Select>
      <Button onClick={save} isLoading={loading} colorScheme="blue">Save</Button>
    </VStack>
  );
}
