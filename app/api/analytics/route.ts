import { NextResponse } from 'next/server';
import { buildAnalytics } from '@/lib/analytics';
import { getBillingRecords } from '@/lib/data-store';
import { FilterState } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: FilterState = {
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      service: searchParams.get('service') || undefined,
    };

    const { records, source } = await getBillingRecords(filters);

    if (!records.length) {
      return NextResponse.json({
        analytics: null,
        source,
      });
    }

    const analytics = buildAnalytics(records);

    return NextResponse.json({
      analytics,
      source,
    });
  } catch (error) {
    console.error('Analytics error:', error);

    return NextResponse.json(
      { message: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
