import { NextResponse } from 'next/server';
import { loadSampleData } from '@/lib/data-store';

export async function POST() {
  await loadSampleData();
  return NextResponse.json({ message: 'Data reset to sample dataset.' });
}
