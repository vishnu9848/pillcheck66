import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({
    timeout: 30000, // 30 second timeout
    retries: 2 // Additional retries at the client level
  })],
  model: 'googleai/gemini-2.5-flash',
});
