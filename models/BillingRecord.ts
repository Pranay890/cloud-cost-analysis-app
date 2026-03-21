import { Schema, model, models } from 'mongoose';

const BillingRecordSchema = new Schema(
  {
    date: { type: String, required: true },
    service_name: { type: String, required: true },
    cost: { type: Number, required: true },
    region: { type: String },
  },
  {
    timestamps: true,
  }
);

export const BillingRecordModel =
  models.BillingRecord || model('BillingRecord', BillingRecordSchema);
