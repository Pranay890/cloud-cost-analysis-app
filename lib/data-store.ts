import { connectToDatabase } from '@/lib/db';
import { filterRecords } from '@/lib/utils';
import { BillingRecord, FilterState } from '@/lib/types';
import { BillingRecordModel } from '@/models/BillingRecord';
import { sampleBillingData } from '@/lib/sample-data';

// ✅ Start with empty records - only populate after CSV upload
let memoryRecords: BillingRecord[] = [];

// ==========================
// ✅ CLEAR DATA (for fresh user start)
// ==========================
export async function clearBillingRecords() {
  memoryRecords = [];
  
  const db = await connectToDatabase();
  if (db.connected) {
    try {
      await BillingRecordModel.deleteMany({});
    } catch (error) {
      console.error('Error clearing MongoDB:', error);
    }
  }
  
  return { cleared: true };
}

// ==========================
// ✅ LOAD SAMPLE DATA (optional - for demo/reset)
// ==========================
export async function loadSampleData() {
  const { persistedToMongo } = await saveBillingRecords(sampleBillingData);
  return { persistedToMongo };
}

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
  let source: 'mongo' | 'memory';

  if (db.connected) {
    const docs = await BillingRecordModel
      .find({}, { _id: 0, __v: 0 })
      .lean<BillingRecord[]>();

    if (docs.length > 0) {
      records = docs;
      source = 'mongo';
    } else {
      records = memoryRecords;
      source = 'memory';
    }
  } else {
    // ✅ fallback (IMPORTANT)
    records = memoryRecords;
    source = 'memory';
  }

  const filtered = filterRecords(records, filters);

  return {
    records: filtered,
    source,
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
