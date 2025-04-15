import mongoose from "mongoose";

// Load Mongo URI and options
const uri: string = process.env.MONGODB_URI || '';
const options: mongoose.ConnectOptions = {
    tls: true,
};

// Caching the Mongoose connection in development mode
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global._mongoose || { conn: null, promise: null };

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

export async function connectToDatabase() {
  try {
    // Return cached connection if already available
    if (cached.conn) {
      return cached.conn;
    }

    // Use cached promise if available, otherwise create a new one
    if (!cached.promise) {
      cached.promise = mongoose
        .connect(uri, { ...options, dbName: 'project' })
        .then((mongooseInstance) => mongooseInstance);
    }

    cached.conn = await cached.promise;
    console.log('Database is connected');
    return cached.conn;
  } catch (error) {
    console.error(error);
    throw new Error("Database connection failed");
  }
}
