import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/database.js";
import initQueue from "./queue/smsQueues.js";

import merchantRoutes from "./routes/merchantRoutes.js";
import smsRoutes from "./routes/smsRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import campaignRoutes from "./routes/campaignRoute.js";
import shopperRoutes from "./routes/shopperRoutes.js";

// --------------------------------------------------
// 🔥 GLOBAL PROCESS SAFETY (VERY IMPORTANT)
// --------------------------------------------------
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise);
  console.error("Reason:", reason);
  // DO NOT exit – let BullMQ / Redis recover
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  // DO NOT exit in Railway
});

// --------------------------------------------------

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- ROUTES ----------------
app.use("/api/merchant", merchantRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/shopper", shopperRoutes);
// ----------------------------------------

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // 1️⃣ Connect MongoDB
    await connectDB();
    console.log("✅ MongoDB connected");

    // 2️⃣ Initialize BullMQ Worker + Queue
    await initQueue();

    // 3️⃣ Start Express Server
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Startup failed:", err);
  }
})();

// --------------------------------------------------
// 🛑 GRACEFUL SHUTDOWN (Railway sends SIGTERM)
// --------------------------------------------------
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received. Shutting down gracefully...");
  process.exit(0);
});
