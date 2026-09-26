import { NextResponse } from 'next/server';
import { evaluateCode } from '../../lib/evaluator';

export async function POST(req) {
  try {
    const body = await req.json();
    const { description, code, language, difficulty } = body;

    if (!description || !code) {
      return NextResponse.json(
        { error: 'Missing required fields: description and code are required.' },
        { status: 400 }
      );
    }

    // Run AI Evaluation with schema validation & 1 retry attempt
    const evalResult = await evaluateCode({
      description,
      code,
      language: language || 'javascript',
      difficulty: difficulty || 'medium',
    });

    return NextResponse.json(evalResult, { status: 200 });
  } catch (e) {
    console.error('[API Evaluate Error]', e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: 'Evaluation failed', details: msg },
      { status: 500 }
    );
  }
}