import { NextResponse } from 'next/server';
import { clearBillingRecords } from '@/lib/data-store';

export async function POST() {
  try {
    await clearBillingRecords();
    return NextResponse.json({ message: 'All data cleared successfully.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to clear data' },
      { status: 500 }
    );
  }
}
