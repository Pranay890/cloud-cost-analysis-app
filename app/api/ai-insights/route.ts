import { NextResponse } from 'next/server';
import { generateAiInsights } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      total_cost?: number;
      services?: { name: string; cost: number }[];
    };

    if (typeof body.total_cost !== 'number' || !body.services?.length) {
      return NextResponse.json({ message: 'Invalid AI insight payload.' }, { status: 400 });
    }

    const insights = await generateAiInsights({
      total_cost: body.total_cost,
      services: body.services,
    });

    return NextResponse.json({ insights });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to generate AI insights.' }, { status: 500 });
  }
}
