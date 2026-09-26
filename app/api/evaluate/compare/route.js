import { NextResponse } from 'next/server';
import { compareModels } from '../../../lib/evaluator';

export async function POST(req) {
  try {
    const body = await req.json();
    const { description, code, language, providerA, providerB } = body;

    if (!description || !code) {
      return NextResponse.json(
        { error: 'Missing required fields: description and code are required.' },
        { status: 400 }
      );
    }

    const comparison = await compareModels({
      description,
      code,
      language: language || 'javascript',
      providerA: providerA || 'mock',
      providerB: providerB || 'gemini',
    });

    return NextResponse.json(comparison, { status: 200 });
  } catch (e) {
    console.error('[API Compare Error]', e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: 'Side-by-side comparison failed', details: msg },
      { status: 500 }
    );
  }
}