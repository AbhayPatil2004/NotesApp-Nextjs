import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error("MONGO_URL missing from .env.local");
  process.exit(1);
}

(async () => {
  try {
    const c = await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected OK to:", c.connection.host, "db:", c.connection.name);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Connect error message:", err?.message);
    console.error("Full error:", err);
    process.exit(2);
  }
})();
