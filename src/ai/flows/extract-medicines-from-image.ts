'use server';
/**
 * @fileOverview Extracts medicine names from an image using OCR.
 *
 * - extractMedicinesFromImage - A function that handles the extraction process.
 * - ExtractMedicinesFromImageInput - The input type for the extractMedicinesFromImage function.
 * - ExtractMedicinesFromImageOutput - The return type for the extractMedicinesFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractMedicinesFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a medicine box, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractMedicinesFromImageInput = z.infer<typeof ExtractMedicinesFromImageInputSchema>;

const ExtractMedicinesFromImageOutputSchema = z.object({
  medicineNames: z.array(z.string()).describe('The list of medicine names extracted from the image.'),
});
export type ExtractMedicinesFromImageOutput = z.infer<typeof ExtractMedicinesFromImageOutputSchema>;

export async function extractMedicinesFromImage(input: ExtractMedicinesFromImageInput): Promise<ExtractMedicinesFromImageOutput> {
  return extractMedicinesFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractMedicinesFromImagePrompt',
  input: {schema: ExtractMedicinesFromImageInputSchema},
  output: {schema: ExtractMedicinesFromImageOutputSchema},
  prompt: `You are a helpful AI assistant tasked with extracting medicine names from an image of a medicine box. Use OCR to read the text in the image and identify the names of the medicines.

  Image: {{media url=photoDataUri}}

  Return a list of medicine names. If a medicine is not identifiable, do not include it in the list.
  Do not hallucinate or invent medicine names.
  Only return the array of strings.`, 
});

const extractMedicinesFromImageFlow = ai.defineFlow(
  {
    name: 'extractMedicinesFromImageFlow',
    inputSchema: ExtractMedicinesFromImageInputSchema,
    outputSchema: ExtractMedicinesFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
