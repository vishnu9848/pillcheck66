'use server';

/**
 * @fileOverview Identifies possible side effects associated with a list of medicines.
 *
 * - identifySideEffects - A function that takes a list of medicine names and returns a list of possible side effects.
 * - IdentifySideEffectsInput - The input type for the identifySideEffects function.
 * - IdentifySideEffectsOutput - The return type for the identifySideEffects function.
 */

import {ai} from '@/ai/genkit';
import { withRetry } from '@/ai/retry';
import {z} from 'genkit';

const IdentifySideEffectsInputSchema = z.object({
  medicineNames: z
    .array(z.string())
    .describe('An array of medicine names to check for side effects.'),
});
export type IdentifySideEffectsInput = z.infer<typeof IdentifySideEffectsInputSchema>;

const IdentifySideEffectsOutputSchema = z.object({
  sideEffects: z
    .array(z.string())
    .describe('An array of possible side effects associated with the given medicines.'),
});
export type IdentifySideEffectsOutput = z.infer<typeof IdentifySideEffectsOutputSchema>;

export async function identifySideEffects(input: IdentifySideEffectsInput): Promise<IdentifySideEffectsOutput> {
  return identifySideEffectsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifySideEffectsPrompt',
  input: {schema: IdentifySideEffectsInputSchema},
  output: {schema: IdentifySideEffectsOutputSchema},
  prompt: `You are a pharmacist. Identify the possible side effects associated with the following medicines:

  {{#each medicineNames}}
  - {{{this}}}
  {{/each}}
  \n  Return the side effects as a list.
  `,
});

const identifySideEffectsFlow = ai.defineFlow(
  {
    name: 'identifySideEffectsFlow',
    inputSchema: IdentifySideEffectsInputSchema,
    outputSchema: IdentifySideEffectsOutputSchema,
  },
  async input => {
    try {
      const { output } = await withRetry(() => prompt(input));
      return output!;
    } catch (err: any) {
      // If retries fail, log detailed error and return a safe fallback with user-friendly message
      // eslint-disable-next-line no-console
      console.error('identifySideEffectsFlow failed after retries:', {
        error: err,
        status: err?.status,
        message: err?.message,
        input
      });
      
      const message = err?.status === 503 
        ? "The AI service is currently experiencing high load. Please try again in a few moments."
        : "Unable to process the request at this time.";
        
      return { 
        sideEffects: [],
        _error: message 
      } as any;
    }
  }
);
