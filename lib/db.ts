import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cache = global.mongooseCache ?? { conn: null, promise: null };

global.mongooseCache = cache;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    return { connected: false as const, connection: null };
  }

  if (cache.conn) {
    return { connected: true as const, connection: cache.conn };
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    });
  }

  try {
    cache.conn = await cache.promise;
    return { connected: true as const, connection: cache.conn };
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory fallback.', error);
    cache.promise = null;
    return { connected: false as const, connection: null };
  }
}
