import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

type DatabaseConnectionState = {
  connected: boolean;
  connection: typeof mongoose | null;
};

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

export async function connectToDatabase(): Promise<DatabaseConnectionState> {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI is not defined. Using in-memory billing data.');
    return { connected: false, connection: null };
  }

  if (cache.conn) {
    return { connected: true, connection: cache.conn };
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  // Optimize database connection fallback
  if (!cache.conn) {
    console.warn('Using in-memory data. Ensure MongoDB is running for production.');
  }

  // Add a timeout for MongoDB connection attempts
  const connectionTimeout = setTimeout(() => {
    console.error('MongoDB connection timeout. Falling back to in-memory data.');
    cache.promise = null;
  }, 5000);

  try {
    cache.conn = await cache.promise;
    clearTimeout(connectionTimeout);
    console.log('MongoDB connected successfully');
    return { connected: true, connection: cache.conn };
  } catch (error) {
    clearTimeout(connectionTimeout);
    cache.promise = null;
    cache.conn = null;
    console.error('MongoDB connection failed. Using in-memory billing data.', error);
    return { connected: false, connection: null };
  }
}
