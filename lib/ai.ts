import OpenAI from 'openai';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function summarizeEntry(content: string) {
  const prompt = `Summarize this personal reflection in <= 16 words, positive and legacy-friendly:\n\n${content}`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6
  });
  return completion.choices[0]?.message?.content?.trim() ?? '';
}
