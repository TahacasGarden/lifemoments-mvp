'use client';
import { useState } from 'react';
import { Button, HStack, Input, useToast } from '@chakra-ui/react';

export default function ShareCreator() {
  const [label, setLabel] = useState('Family Link');
  const toast = useToast();

  const createShare = async () => {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, allowed_visibility: ['family','public'] })
    });
    const data = await res.json();
    if (data?.token) {
      const url = `${location.origin}/share/${data.token}`;
      await navigator.clipboard.writeText(url);
      toast({ title: 'Share link copied to clipboard', status: 'success' });
    } else {
      toast({ title: 'Failed to create share link', status: 'error' });
    }
  };

  return (
    <HStack bg="white" p={4} rounded="md" shadow="sm" border="1px solid" borderColor="gray.200">
      <Input value={label} onChange={(e)=>setLabel(e.target.value)} placeholder="Link label" />
      <Button onClick={createShare} colorScheme="blue">Create Share Link</Button>
    </HStack>
  );
}
