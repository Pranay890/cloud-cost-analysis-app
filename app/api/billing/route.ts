import { NextResponse } from 'next/server';
import { saveBillingRecords, getBillingRecords } from '@/lib/data-store';
import { BillingRecord } from '@/lib/types';

// 🔥 VERY IMPORTANT (prevents caching)
export const dynamic = 'force-dynamic';

// ============================
// ✅ POST → SAVE DATA
// ============================
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { records?: BillingRecord[] };

    if (!body.records || !Array.isArray(body.records) || body.records.length === 0) {
      return NextResponse.json(
        { message: 'No billing records provided.' },
        { status: 400 }
      );
    }

    // ✅ SAVE DATA (CRITICAL)
    await saveBillingRecords(body.records);

    return NextResponse.json({
      message: 'Billing data uploaded and processed successfully.',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to upload billing data.' },
      { status: 500 }
    );
  }
}

// ============================
// ✅ GET → RETURN DATA
// ============================
export async function GET() {
  try {
    const { records, source } = await getBillingRecords();

    return NextResponse.json({ records, source });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to fetch billing data.' },
      { status: 500 }
    );
  }
}