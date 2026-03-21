import { connectToDatabase } from '@/lib/db';
import { sampleBillingData } from '@/lib/sample-data';
import { filterRecords } from '@/lib/utils';
import { BillingRecord, FilterState } from '@/lib/types';
import { BillingRecordModel } from '@/models/BillingRecord';

let memoryRecords: BillingRecord[] = [...sampleBillingData];

export async function saveBillingRecords(records: BillingRecord[]) {
  const db = await connectToDatabase();

  if (db.connected) {
    await BillingRecordModel.deleteMany({});
    await BillingRecordModel.insertMany(records);
  }

  memoryRecords = records;
  return { persistedToMongo: db.connected };
}

export async function getBillingRecords(filters?: FilterState) {
  const db = await connectToDatabase();

  let records: BillingRecord[] = memoryRecords;

  if (db.connected) {
    const docs = await BillingRecordModel.find({}, { _id: 0, __v: 0 }).lean();
    records = docs as BillingRecord[];
  }

  const filtered = filterRecords(records, filters);

  return {
    records: filtered,
    source: db.connected ? 'mongo' : 'memory',
  };
}

export async function resetBillingRecords() {
  const db = await connectToDatabase();
  memoryRecords = [...sampleBillingData];

  if (db.connected) {
    await BillingRecordModel.deleteMany({});
    await BillingRecordModel.insertMany(memoryRecords);
  }

  return { persistedToMongo: db.connected };
}
