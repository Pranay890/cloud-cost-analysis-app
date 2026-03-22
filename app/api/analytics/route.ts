import { NextResponse } from 'next/server';
import { buildAnalytics } from '@/lib/analytics';
import { getBillingRecords } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const { records, source } = await getBillingRecords({
    startDate: searchParams.get('startDate') ?? undefined,
    endDate: searchParams.get('endDate') ?? undefined,
    service: searchParams.get('service') ?? undefined,
  });

  const analytics = buildAnalytics(records);

  return NextResponse.json({ analytics, source });
}
