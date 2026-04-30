import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getFundamentals } from '@/lib/yahoo';

const querySchema = z.object({
  symbol: z
    .string()
    .min(1, 'Symbol is required')
    .max(20, 'Symbol too long')
    .regex(/^[A-Za-z0-9.\-^=]+$/, 'Invalid symbol format'),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const rawParams = { symbol: searchParams.get('symbol') ?? '' };

  const parsed = querySchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid symbol parameter' },
      { status: 400 },
    );
  }

  try {
    const info = await getFundamentals(parsed.data.symbol);
    return NextResponse.json(info);
  } catch (err) {
    console.error('[api/fundamentals] Error fetching fundamentals:', err);
    return NextResponse.json(
      { error: 'Failed to fetch fundamentals' },
      { status: 500 },
    );
  }
}
