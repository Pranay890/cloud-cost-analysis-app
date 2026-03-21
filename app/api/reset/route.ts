import { NextResponse } from 'next/server';
import { resetBillingRecords } from '@/lib/data-store';

export async function POST() {
  await resetBillingRecords();
  return NextResponse.json({ message: 'Data reset to sample dataset.' });
}
