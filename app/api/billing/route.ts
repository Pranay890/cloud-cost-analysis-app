import { NextResponse } from 'next/server';
import { getBillingRecords, saveBillingRecords } from '@/lib/data-store';
import { BillingRecord as BillingRecordType } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      records?: BillingRecordType[];
    };

    if (!body.records || !Array.isArray(body.records) || body.records.length === 0) {
      return NextResponse.json(
        { message: 'No billing records provided.' },
        { status: 400 }
      );
    }

    const { persistedToMongo } = await saveBillingRecords(body.records);

    return NextResponse.json({
      message: 'Billing data uploaded successfully.',
      count: body.records.length,
      source: persistedToMongo ? 'mongo' : 'memory',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Failed to upload billing data.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { records, source } = await getBillingRecords();

    return NextResponse.json({
      records,
      source,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch billing data.' },
      { status: 500 }
    );
  }
}
