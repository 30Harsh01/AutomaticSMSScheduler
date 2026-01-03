// controllers/campaignController.js

import Campaign from "../models/campaignSchema.js";

export const createCampaign = async (req, res) => {
    try {
        const { message, recipients, scheduledAt,subject } = req.body;
        const campaign = new Campaign({ merchantId: req.user._id, subject,message, recipients, scheduledAt });
        await campaign.save();

        res.status(201).json({ message: 'Campaign created successfully', campaign });
    } catch (error) {
        console.log("error",error)
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const getCampaigns = async (req, res) => {
    try {
        
        const campaigns = await Campaign.find({ merchantId: req.user._id })
            .populate('recipients', 'phone'); // Populate recipients, fetching only name & email

        res.json(campaigns);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

