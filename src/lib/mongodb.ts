import AppConfig from "../config/app.config";
import mongoose from "mongoose";

const MONGODB_URI = AppConfig.DATABASE.MONGODB_URI;
const MONGODB_DB_NAME = AppConfig.DATABASE.MONGODB_DB_NAME;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!MONGODB_DB_NAME) {
  console.warn("⚠️ MONGODB_DB_NAME not specified, using default database from connection string");
}

// Construct the full connection URI with database name
const getConnectionURI = () => {
  if (MONGODB_DB_NAME) {
    // If database name is provided, append it to the URI
    const baseURI = MONGODB_URI.replace(/\/$/, ''); // Remove trailing slash if present
    return `${baseURI}/${MONGODB_DB_NAME}`;
  }
  return MONGODB_URI;
};

const CONNECTION_URI = getConnectionURI();

interface GlobalMongoDB {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare const globalThis: {
  mongodb: GlobalMongoDB;
} & typeof global;

let cached = globalThis.mongodb;

if (!cached) {
  cached = globalThis.mongodb = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(`🔌 Connecting to MongoDB: ${CONNECTION_URI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
    console.log(`📊 Database: ${MONGODB_DB_NAME || 'default'}`);
    
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 60000,
      serverSelectionTimeoutMS: 60000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      family: 4, // Use IPv4 only
    };

    cached.promise = mongoose.connect(CONNECTION_URI, opts).then((mongoose) => {
      console.log(`✅ Connected to MongoDB successfully`);
      console.log(`📊 Database name: ${mongoose.connection.db?.databaseName || 'unknown'}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
