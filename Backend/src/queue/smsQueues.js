// // queue/smsQueues.js
// import { Queue, Worker } from 'bullmq';
// import Campaign from '../models/campaignSchema.js';
// import sendSMS from '../utils/smsSender.js';
// import { processCampaignNow } from '../controllers/smsRoutesController.js';
// import dotenv from 'dotenv';

// dotenv.config({ path: '../.env' });

// let smsQueue;
// let worker;

// const initQueue = async () => {
//   if (smsQueue) return smsQueue;

//   const redisConfig = {
//     host: process.env.REDIS_HOST,
//     port: Number(process.env.REDIS_PORT),
//     password: process.env.REDIS_PASSWORD || undefined,
//   };

//   // ✅ Initialize Queue
//   smsQueue = new Queue('smsQueue', { connection: redisConfig });

//   // ✅ Initialize Worker
//   worker = new Worker(
//     'smsQueue',
//     async (job) => {
//       console.log(`📨 Processing job: ${job.name}`);

//       if (job.name === 'processCampaign') {
//         const campaign = await Campaign
//           .findById(job.data.campaignId)
//           .populate('recipients');

//         if (!campaign || campaign.status === 'Sent') return;

//         const recipientPhones = campaign.recipients.map(r => r.phone);

//         await processCampaignNow(
//           job.data.campaignId,
//           recipientPhones,
//           campaign.subject,
//           campaign.message,
//           smsQueue
//         );
//         return;
//       }

//       if (job.name === 'sendSMS') {
//         // 🔥 MUST throw on failure
//         await sendSMS(
//           job.data.recipient,
//           job.data.subject,
//           job.data.message
//         );
//         return;
//       }
//     },
//     {
//       connection: redisConfig,
//       concurrency: 5,
//     }
//   );

//   // -------------------------
//   // ✅ JOB COMPLETED HANDLER
//   // -------------------------
//   worker.on('completed', async (job) => {
//     if (job.name !== 'sendSMS') return;

//     const { campaignId } = job.data;

//     const campaign = await Campaign.findById(campaignId);
//     if (!campaign || campaign.status === 'Failed') return;

//     campaign.successCount += 1;

//     if (campaign.successCount === campaign.totalCount) {
//       campaign.status = 'Sent';
//     }

//     await campaign.save();

//     console.log(
//       `✅ SMS success ${campaign.successCount}/${campaign.totalCount} for campaign ${campaignId}`
//     );
//   });

//   // -------------------------
//   // ❌ JOB FAILED HANDLER
//   // -------------------------
//   worker.on('failed', async (job, err) => {
//     console.error(`❌ Job ${job?.id} failed:`, err);

//     if (job?.name === 'sendSMS') {
//       await Campaign.findByIdAndUpdate(
//         job.data.campaignId,
//         { status: 'Failed' }
//       );
//     }
//   });

//   worker.on('error', (err) => {
//     console.error('❌ Worker error:', err);
//   });

//   console.log('📥 SMS Queue Worker Running');
//   return smsQueue;
// };

// export default initQueue;
















import { Queue, Worker } from "bullmq";
import Campaign from "../models/campaignSchema.js";
import sendSMS from "../utils/smsSender.js";
import { processCampaignNow } from "../controllers/smsRoutesController.js";
import dotenv from "dotenv";

dotenv.config();

let smsQueue;
let worker;

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,

  // 🔥 REQUIRED FOR BULLMQ
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy(times) {
    console.log(`🔁 Redis retry attempt ${times}`);
    return Math.min(times * 100, 2000);
  },
};

const initQueue = async () => {
  if (smsQueue) return smsQueue;

  smsQueue = new Queue("smsQueue", { connection: redisConfig });

  worker = new Worker(
    "smsQueue",
    async (job) => {
      console.log(`📨 Processing job: ${job.name}`);

      if (job.name === "processCampaign") {
        const campaign = await Campaign.findById(job.data.campaignId).populate("recipients");
        if (!campaign || campaign.status === "Sent") return;

        const recipients = campaign.recipients.map((r) => r.phone);

        await processCampaignNow(
          job.data.campaignId,
          recipients,
          campaign.subject,
          campaign.message,
          smsQueue
        );
      }

      if (job.name === "sendSMS") {
        await sendSMS(job.data.recipient, job.data.subject, job.data.message);
      }
    },
    { connection: redisConfig, concurrency: 5 }
  );

  // ✅ SUCCESS HANDLER
  worker.on("completed", async (job) => {
    if (job.name !== "sendSMS") return;

    const campaign = await Campaign.findById(job.data.campaignId);
    if (!campaign || campaign.status === "Failed") return;

    campaign.successCount += 1;

    if (campaign.successCount >= campaign.totalCount) {
      campaign.status = "Sent";
    }

    await campaign.save();

    console.log(`✅ SMS success ${campaign.successCount}/${campaign.totalCount}`);
  });

  // ❌ FAILURE HANDLER
  worker.on("failed", async (job, err) => {
    console.error(`❌ Job failed ${job?.id}`, err);

    if (job?.name === "sendSMS") {
      await Campaign.findByIdAndUpdate(job.data.campaignId, {
        status: "Failed",
      });
    }
  });

  worker.on("error", (err) => {
    console.error("❌ Worker error:", err);
  });

  console.log("📥 SMS Queue Worker Running");
  return smsQueue;
};

export default initQueue;
