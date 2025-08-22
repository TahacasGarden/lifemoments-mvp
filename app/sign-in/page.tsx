'use client';
import { useState } from 'react';
import { sb } from '@/lib/supabase-browser';
import { Box, Button, Container, Heading, Input, Text, VStack, Divider } from '@chakra-ui/react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);

  const send = async () => {
    if (!email) return;
    setLoading(true);
    const supabase = sb();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== 'undefined' ? `${location.origin}/dashboard` : undefined } });
    setLoading(false);
    if (!error) setSent(true);
    else alert(error.message);
  };

  return (
    <Container maxW="md" py={16}>
      <VStack spacing={4} align="stretch">
        <Heading size="lg">Sign In</Heading>
        <Text>Enter your email and we'll send you a magic link.</Text>
        <Input placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Button onClick={send} isLoading={loading} colorScheme="blue">Send Link</Button>
        {sent && <Box bg="green.50" p={3} rounded="md">Check your email!</Box>}
      </VStack>
    </Container>
  );
}
