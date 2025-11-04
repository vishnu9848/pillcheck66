'use server';

/**
 * @fileOverview A drug interaction checker AI agent.
 *
 * - checkDrugInteractions - A function that handles the drug interaction checking process.
 * - CheckDrugInteractionsInput - The input type for the checkDrugInteractions function.
 * - CheckDrugInteractionsOutput - The return type for the checkDrugInteractions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { withRetry } from '@/ai/retry';

const CheckDrugInteractionsInputSchema = z.object({
  medicineNames: z
    .array(z.string())
    .describe('An array of medicine names to check for interactions.'),
  age: z.number().describe('The age of the user.'),
  gender: z.enum(['Male', 'Female', 'Other']).describe('The gender of the user.'),
});
export type CheckDrugInteractionsInput = z.infer<
  typeof CheckDrugInteractionsInputSchema
>;

const CheckDrugInteractionsOutputSchema = z.object({
  interactions: z
    .array(z.string())
    .describe('A list of potential drug-to-drug interactions.'),
  summary: z.string().describe('A summary of the potential interactions.'),
});
export type CheckDrugInteractionsOutput = z.infer<
  typeof CheckDrugInteractionsOutputSchema
>;

export async function checkDrugInteractions(
  input: CheckDrugInteractionsInput
): Promise<CheckDrugInteractionsOutput> {
  return checkDrugInteractionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkDrugInteractionsPrompt',
  input: {schema: CheckDrugInteractionsInputSchema},
  output: {schema: CheckDrugInteractionsOutputSchema},
  prompt: `You are a pharmacist specializing in drug interactions.

You will be provided a list of medicine names, the user's age, and the user's gender.

You will check for potential drug-to-drug interactions between the medicines and provide a summary of these interactions.

Medicines: {{medicineNames}}
Age: {{age}}
Gender: {{gender}}

Consider the user's age and gender when determining potential interactions.

Provide the interactions in a list and a summary.
`,
});

const checkDrugInteractionsFlow = ai.defineFlow(
  {
    name: 'checkDrugInteractionsFlow',
    inputSchema: CheckDrugInteractionsInputSchema,
    outputSchema: CheckDrugInteractionsOutputSchema,
  },
  async input => {
    try {
      const { output } = await withRetry(() => prompt(input), 3, 500);
      return output!;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('checkDrugInteractionsFlow failed after retries:', err);
      // Return a safe fallback indicating no interactions found when the AI is unavailable
      return { interactions: [], summary: 'Could not retrieve interactions at this time.' } as any;
    }
  }
);
