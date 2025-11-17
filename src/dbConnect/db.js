// src/dbConnect/db.js
import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) throw new Error("MongoDB URL is missing in environment variables");

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URL) // mongoose 7+ and driver 4+ don't need useNewUrlParser/useUnifiedTopology
      .then((m) => {
        console.log("Mongoose connected:", { host: m.connection?.host, db: m.connection?.name });
        return m;
      })
      .catch((err) => {
        console.error("Mongoose connection ERROR message:", err?.message);
        console.error("Mongoose connection ERROR full:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
