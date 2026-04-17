import { NextResponse } from 'next/server';
import { generateAiInsights } from '@/lib/ai';
import { getBillingRecords } from '@/lib/data-store';
import { buildAnalytics } from '@/lib/analytics';

// ==============================
// ✅ GET → AUTO FETCH FROM DB
// ==============================
export async function GET() {
  try {
    const { records } = await getBillingRecords();

    if (!records.length) {
      return NextResponse.json({
        insights: 'No billing data available. Please upload CSV first.',
      });
    }

    const analytics = buildAnalytics(records);

    const insights = await generateAiInsights({
      total_cost: analytics.totalCost,
      services: analytics.topServices.map((s) => ({
        name: s.service,
        cost: s.cost,
      })),
    });

    return NextResponse.json({ insights });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to generate AI insights.' },
      { status: 500 }
    );
  }
}

// ==============================
// ✅ POST → MANUAL INPUT (OPTIONAL)
// ==============================
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      total_cost?: number;
      services?: { name: string; cost: number }[];
    };

    if (typeof body.total_cost !== 'number' || !body.services?.length) {
      return NextResponse.json(
        { message: 'Invalid AI insight payload.' },
        { status: 400 }
      );
    }

    const insights = await generateAiInsights({
      total_cost: body.total_cost,
      services: body.services,
    });

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('AI Insights generation failed:', error);
    return NextResponse.json(
      { message: 'Failed to generate AI insights. Please try again later.' },
      { status: 500 }
    );
  }
}