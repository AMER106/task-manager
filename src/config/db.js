// config/db.js
import mongoose from "mongoose"; // ← Import the Mongoose library (our MongoDB helper)
import env from "./env.js"; // ← Import our validated environment variables (DB_URL lives here)

// This is the main function that connects to MongoDB
export const connectDB = async () => {
  try {
    // The actual connection line — this is what talks to MongoDB
    await mongoose.connect(env.data.DB_URL, {
      // These are modern, recommended options (2024–2025 style)

      serverSelectionTimeoutMS: 5000,
      // → If MongoDB server doesn't respond in 5 seconds → give up quickly (fail fast)

      maxPoolSize: 10,
      // → Maximum number of connections we keep open (like 10 open phone lines)
      //   Good balance between performance and resource usage

      socketTimeoutMS: 45000,
      // → If a query takes longer than 45 seconds → close that connection
      //   Prevents hanging forever on bad/slow queries

      family: 4,
      // → Prefer IPv4 instead of IPv6
      //   (Some systems + Node.js versions have strange IPv6 bugs)
    });

    // If we reach here → connection was successful!
    console.log("MongoDB Connected ✓");

    // ─────────────────────────────────────────────────────────────
    // These are event listeners — they run automatically later
    // when something happens with the connection

    mongoose.connection.on("connected", () => {
      // This event fires when connection becomes active (sometimes again after reconnect)
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      // Something bad happened (network drop, wrong password, server down, etc)
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      // MongoDB connection was lost (internet dropped, server restarted, etc)
      console.log("Mongoose disconnected! Reconnecting...");
      // Mongoose automatically tries to reconnect by default (good enough for most cases)
    });
  } catch (err) {
    // This catch block runs only if the **initial connection** fails
    // (wrong URL, no internet, wrong credentials, etc)

    console.error("MongoDB connection failed:", err);

    // Very important in production:
    // If we can't connect to database → don't start the server at all
    process.exit(1);
    // → 1 means "error exit" — tells the system/hosting service something went wrong
  }
};
