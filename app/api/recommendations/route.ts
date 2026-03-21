import { NextResponse } from 'next/server';
import { getBillingRecords } from '@/lib/data-store';
import { buildRuleBasedRecommendations } from '@/lib/utils';

export async function GET() {
  const { records } = await getBillingRecords();
  const recommendations = buildRuleBasedRecommendations(records);

  return NextResponse.json({ recommendations });
}
