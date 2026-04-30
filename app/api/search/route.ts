import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchTickers } from '@/lib/yahoo';

const querySchema = z.object({
  q: z.string().min(2, 'Query must be at least 2 characters'),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const rawParams = { q: searchParams.get('q') ?? '' };

  const parsed = querySchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid query parameter' },
      { status: 400 },
    );
  }

  try {
    const results = await searchTickers(parsed.data.q);
    return NextResponse.json(results);
  } catch (err) {
    console.error('[api/search] Error fetching search results:', err);
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 500 },
    );
  }
}
