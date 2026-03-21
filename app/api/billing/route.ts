import { NextResponse } from 'next/server';
import { saveBillingRecords } from '@/lib/data-store';
import { BillingRecord } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { records?: BillingRecord[] };

    if (!body.records?.length) {
      return NextResponse.json({ message: 'No billing records provided.' }, { status: 400 });
    }

    await saveBillingRecords(body.records);

    return NextResponse.json({ message: 'Billing data uploaded and processed successfully.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to upload billing data.' }, { status: 500 });
  }
}
