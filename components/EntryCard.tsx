'use client';
import { Badge, Box, Text } from '@chakra-ui/react';

export default function EntryCard({ entry }: { entry: any }) {
  return (
    <Box bg="white" p={4} rounded="md" shadow="sm" border="1px solid" borderColor="gray.200">
      <Badge>{entry.visibility}</Badge>
      <Text fontWeight="bold" mt={2}>{entry.summary || '—'}</Text>
      <Text mt={1} color="gray.700" whiteSpace="pre-wrap">{entry.content}</Text>
      <Text mt={2} fontSize="sm" color="gray.500">
        {new Date(entry.created_at).toLocaleString()}
      </Text>
    </Box>
  );
}
