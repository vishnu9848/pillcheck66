import { config } from 'dotenv';
config();

import '@/ai/flows/check-drug-interactions.ts';
import '@/ai/flows/identify-side-effects.ts';
import '@/ai/flows/extract-medicines-from-image.ts';
import '@/ai/flows/answer-medicine-questions.ts';