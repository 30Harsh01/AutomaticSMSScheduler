// controllers/smsRoutesController.js
import mongoose from 'mongoose';
import Campaign from '../models/campaignSchema.js';
import { chargeMerchant } from './billingController.js';
import initQueue from '../queue/smsQueues.js'; // lazy init of BullMQ queue

// Helper to get the queue instance
let smsQueueInstance;
const getSMSQueue = async () => {
  if (!smsQueueInstance) {
    smsQueueInstance = await initQueue();
  }
  return smsQueueInstance;
};

// ----------------------
// Get SMS charge for a campaign
// ----------------------
export const getSMSCharge = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const campaign = await Campaign.findById(campaignId).populate('recipients');

    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const { recipients, merchantId, status } = campaign;

    if (merchantId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Unauthorized' });

    if (!Array.isArray(recipients) || recipients.length === 0)
      return res.status(400).json({ message: 'No recipients found for this campaign' });

    if (status === 'Sent')
      return res.status(400).json({ message: 'Campaign already processed' });

    const amountToCharge = recipients.length;

    return res.json({
      message: `You will be charged ${amountToCharge} credits for this campaign.`,
      amount: amountToCharge,
    });
  } catch (error) {
    console.error('Error in getSMSCharge:', error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ----------------------
// Confirm and send SMS
// ----------------------


export const confirmAndSendSMS = async (req, res) => {
  let campaign; // ✅ Declare OUTSIDE

  try {
    const campaignId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(campaignId))
      return res.status(400).json({ message: 'Invalid campaign ID format' });

    campaign = await Campaign.findById(campaignId).populate('recipients');

    if (!campaign)
      return res.status(404).json({ message: 'Campaign not found' });

    const { subject, message, recipients, merchantId, scheduledAt, status } = campaign;

    if (merchantId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Unauthorized' });

    if (status === 'Sent')
      return res.status(400).json({ message: 'Campaign already processed' });

    if (!Array.isArray(recipients) || recipients.length === 0)
      return res.status(400).json({ message: 'No recipients found for this campaign' });

    console.log(`Confirmed SMS job for campaign: ${campaignId}, total recipients: ${recipients.length}`);
    campaign.totalCount = recipients.length;

    const recipientPhones = recipients.map(r => r.phone);

    // Charge merchant
    const amountToCharge = recipientPhones.length;
    const chargeResponse = await chargeMerchant(
      { body: { merchantId, amount: amountToCharge } },
      { status: () => ({ json: data => data }) }
    );

    if (chargeResponse.message === 'Insufficient balance') {
      campaign.status = 'Failed';
      await campaign.save();
      return res.status(400).json({ message: 'Insufficient balance. Please add credits.' });
    }

    const smsQueue = await getSMSQueue();

    if (scheduledAt) {
      const delay = new Date(scheduledAt).getTime() - Date.now();

      if (delay <= 0) {
        campaign.status = 'Failed';
        await campaign.save();
        return res.status(400).json({ message: 'Schedule time already passed' });
      }

      await smsQueue.add(
        'processCampaign',
        { campaignId: campaignId.toString() },
        { delay }
      );

      campaign.status = 'Scheduled';
      await campaign.save();

      return res.json({ message: 'Campaign scheduled successfully', scheduledAt });
    }

    await processCampaignNow(
      campaignId.toString(),
      recipientPhones,
      subject,
      message,
      smsQueue
    );

    campaign.status = 'Processing';
    await campaign.save();

    return res.json({ message: 'SMS processing started immediately' });

  } catch (error) {
    console.error('Error in confirmAndSendSMS:', error);

    // ✅ SAFE UPDATE
    if (campaign) {
      campaign.status = 'Failed';
      await campaign.save();
    }

    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};


// ----------------------
// Process campaign now
// ----------------------
export const processCampaignNow = async (campaignId, recipientPhones, subject, message, smsQueue) => {
  try {
    await Promise.all(
      recipientPhones.map(async (phone) => {
        console.log('Adding job:', { campaignId, recipient: phone, message, subject });
        await smsQueue.add('sendSMS', { campaignId, recipient: phone, subject, message });
      })
    );

    await Campaign.findByIdAndUpdate(campaignId, { status: 'Sent' });
    console.log(`Campaign ${campaignId} processed successfully.`);
  } catch (error) {
    console.error(`Error processing campaign ${campaignId}:`, error);
  }
};
