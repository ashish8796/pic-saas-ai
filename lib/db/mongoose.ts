import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

export const mongooseConnection: MongooseConnection = {
  conn: null,
  promise: null,
};

let cached: MongooseConnection = (global as any).mongoose || {};

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!MONGODB_URL) {
      throw new Error(
        "Please define the MONGODB_URL environment variable inside .env.local"
      );
    }

    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URL, {
        dbName: "pic-saas-ai",
        bufferCommands: false,
      });

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }

  if (!MONGODB_URL) {
    throw new Error(
      "Please define the MONGODB_URL environment variable inside .env.local"
    );
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "pic-saas-ai",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
