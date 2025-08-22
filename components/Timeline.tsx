'use client';
import { useEffect, useState } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import EntryCard from './EntryCard';

export default function Timeline() {
  const [entries, setEntries] = useState<any[]>([]);

  async function load() {
    const res = await fetch('/api/entries', { cache: 'no-store' });

    // Graceful fallback if response is empty or non-JSON
    let data: any = { entries: [] };
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : { entries: [] };
    } catch {
      data = { entries: [] };
    }

    setEntries(Array.isArray(data.entries) ? data.entries : []);
  }

  useEffect(() => {
    load();
    const h = () => load();
    document.addEventListener('entries:refresh', h);
    return () => document.removeEventListener('entries:refresh', h);
  }, []);

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {entries.map((e) => <EntryCard key={e.id} entry={e} />)}
    </SimpleGrid>
  );
}
