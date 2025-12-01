import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { description, code } = body;

    if (!description || !code) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    }
    
    // 🔮 Fake "AI" evaluation for demo
    const score = 78; // arbitrary score
    const strengths = [
      'Code is syntactically valid JavaScript.',
      'Logic is mostly clear and readable.',
      'Uses basic constructs in an understandable way.',
    ];
    const improvements = [
      'Add error handling for invalid inputs.',
      'Cover more edge cases (empty arrays, null, etc.).',
      'Improve variable naming and add comments.',
    ];
    const refactored_code = `// Example refactored version\n${code}`;

    return NextResponse.json({
      score,
      strengths,
      improvements,
      refactored_code,
    });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: 'Internal error in /api/evaluate', details: msg },
      { status: 500 }
    );
  }
}
