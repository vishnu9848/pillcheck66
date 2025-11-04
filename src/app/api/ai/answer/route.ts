import { NextRequest, NextResponse } from 'next/server';
import { answerMedicineQuestions } from '@/ai/flows/answer-medicine-questions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question = body?.question;
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Missing question' }, { status: 400 });
    }

  const result = await answerMedicineQuestions({ question });
  // result now contains structured fields: summary, mechanism, analogy, keyPoints, visuals
  return NextResponse.json(result);
  } catch (err: any) {
    console.error('AI answer route error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
