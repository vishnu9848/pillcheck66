'use server';

/**
 * @fileOverview A flow that allows users to ask questions about medicines, side effects, emergency steps, and precautions.
 *
 * - answerMedicineQuestions - A function that handles answering questions about medicines.
 * - AnswerMedicineQuestionsInput - The input type for the answerMedicineQuestions function.
 * - AnswerMedicineQuestionsOutput - The return type for the answerMedicineQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { withRetry } from '@/ai/retry';

const AnswerMedicineQuestionsInputSchema = z.object({
  question: z.string().describe('The question about medicines, side effects, emergency steps, or precautions.'),
});
export type AnswerMedicineQuestionsInput = z.infer<typeof AnswerMedicineQuestionsInputSchema>;

const AnswerMedicineQuestionsOutputSchema = z.object({
  summary: z.string().describe('A short summary.'),
  mechanism: z.string().describe('Detailed mechanism or explanation.'),
  analogy: z.string().describe('A concise analogy to help students understand.'),
  keyPoints: z.array(z.string()).describe('Important bullet points.'),
  visuals: z.string().optional().describe('Suggested visuals or diagrams (text description).'),
});
export type AnswerMedicineQuestionsOutput = z.infer<typeof AnswerMedicineQuestionsOutputSchema>;

export async function answerMedicineQuestions(input: AnswerMedicineQuestionsInput): Promise<AnswerMedicineQuestionsOutput> {
  return answerMedicineQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerMedicineQuestionsPrompt',
  input: {schema: AnswerMedicineQuestionsInputSchema},
  output: {schema: AnswerMedicineQuestionsOutputSchema},
  prompt: `You are Vinnu, an AI assistant inside a website called PillCheck AI.
You are an expert in medicines, side effects, emergency steps, and precautions.

For medical students, produce a structured, educational answer. Respond ONLY with a JSON object matching this shape:
{"summary":"...","mechanism":"...","analogy":"...","keyPoints":["...","..."],"visuals":"..."}

Instructions:
- Keep "summary" to 1-2 short sentences.
- "mechanism" should be a concise explanation (2-4 short paragraphs) with technical detail.
- "analogy" must contain a clear analogy to aid understanding (1-3 sentences).
- "keyPoints" should be an array of 3-6 short bullet-style strings.
- "visuals" may suggest a labelled diagram or stepwise visual description (optional).

Question: {{{question}}}`,
});

const answerMedicineQuestionsFlow = ai.defineFlow(
  {
    name: 'answerMedicineQuestionsFlow',
    inputSchema: AnswerMedicineQuestionsInputSchema,
    outputSchema: AnswerMedicineQuestionsOutputSchema,
  },
  async input => {
    try {
      const { output } = await withRetry(() => prompt(input), 3, 500);
      return output!;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('answerMedicineQuestionsFlow failed after retries:', err);
      // Return a minimal fallback so UI can show an explanatory message
      return {
        summary: 'The AI is temporarily unavailable. Please try again shortly.',
        mechanism: '',
        analogy: '',
        keyPoints: [],
        visuals: undefined,
      } as any;
    }
  }
);
