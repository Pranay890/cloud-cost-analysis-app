import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Ensure email index for fast lookups
UserSchema.index({ email: 1 });

export const UserModel = models.User || model('User', UserSchema);
