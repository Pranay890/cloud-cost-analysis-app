import { connectToDatabase } from '@/lib/db';
import { filterRecords } from '@/lib/utils';
import { BillingRecord, FilterState } from '@/lib/types';
import { BillingRecordModel } from '@/models/BillingRecord';
import { sampleBillingData } from '@/lib/sample-data';

// ✅ fallback memory
let memoryRecords: BillingRecord[] = [...sampleBillingData];

// ==========================
// ✅ SAVE DATA
// ==========================
export async function saveBillingRecords(records: BillingRecord[]) {
  const db = await connectToDatabase();

  if (db.connected) {
    await BillingRecordModel.deleteMany({});
    await BillingRecordModel.insertMany(records);
  }

  // ✅ always update memory
  memoryRecords = records;

  return { persistedToMongo: db.connected };
}

// ==========================
// ✅ GET DATA
// ==========================
export async function getBillingRecords(filters?: FilterState) {
  const db = await connectToDatabase();

  let records: BillingRecord[];

  if (db.connected) {
    const docs = await BillingRecordModel
      .find({}, { _id: 0, __v: 0 })
      .lean<BillingRecord[]>();

    records = docs;
  } else {
    // ✅ fallback (IMPORTANT)
    records = memoryRecords;
  }

  const filtered = filterRecords(records, filters);

  return {
    records: filtered,
    source: db.connected ? 'mongo' : 'memory',
  };
}

// ==========================
// ✅ RESET DATA
// ==========================
export async function resetBillingRecords() {
  const db = await connectToDatabase();

  memoryRecords = [...sampleBillingData];

  if (db.connected) {
    await BillingRecordModel.deleteMany({});
    await BillingRecordModel.insertMany(memoryRecords);
  }

  return { persistedToMongo: db.connected };
}