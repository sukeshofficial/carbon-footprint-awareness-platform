import mongoose from "mongoose";

// Module-level cache — survives across serverless warm invocations
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  // Already connected — reuse
  if (cached.conn) return cached.conn;

  // Connection in progress — wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      const error = new Error('MONGO_URI is not defined in environment variables');
      error.statusCode = 500;
      throw error;
    }

    if (process.env.NODE_ENV === 'production' && uri.includes('localhost')) {
      console.warn('WARNING: MONGO_URI is pointing to localhost in production!');
    }

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        console.error(`Mongoose connection promise rejected: ${err.message}`);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

export default connectDB;
