import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { translate } from '@vitalets/google-translate-api';

const schema = z.object({
  text: z.string().min(1).max(5000),
  target: z.enum(['ro', 'en']),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const { text, target } = parsed.data;
    const result = await translate(text, { to: target });
    return NextResponse.json({ translated: result.text });
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
