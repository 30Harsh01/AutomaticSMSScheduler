import { useState } from 'react';
import toast from 'react-hot-toast';

const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [smsCharge, setSmsCharge] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = localStorage.getItem('authToken');

  // Create a new campaign
  const createCampaign = async (campaignDetails) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/campaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },
        body: JSON.stringify(campaignDetails),
      });

      const data = await response.json();
      console.log("Create campaign response:", data);

      if (response.ok) {
        toast.success(data.message);
        setCampaigns((prev) => [...prev, data.campaign]);

        // After successful campaign creation, fetch SMS charge
        await getSMSCharge(data.campaign._id);
      } else {
        toast.error(data.message || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || 'Error creating campaign');
    }
  };

  // Get SMS charge
  const getSMSCharge = async (campaignId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sms/getcharge/${campaignId}`, {
        method: 'GET',
        headers: {
          'Authorization': authToken,
        },
      });

      const data = await response.json();
      console.log("SMS charge response:", data);

      if (response.ok) {
        setSmsCharge(data.amount);

        // Show confirmation dialog before sending SMS
        if (window.confirm(data.message)) {
          await confirmAndSendSMS(campaignId);
        }
      } else {
        toast.error(data.message || 'Failed to fetch SMS charge');
      }
    } catch (error) {
      console.error('Error fetching SMS charge:', error);
      toast.error(error.message || 'Error fetching SMS charge');
    }
  };

  // Confirm and send SMS campaign
  const confirmAndSendSMS = async (campaignId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sms/sendsms/${campaignId}`, {
        method: 'POST',
        headers: {
          'Authorization': authToken,
        },
      });

      const data = await response.json();
      console.log("Send SMS response:", data);

      if (response.ok) {
        toast.success(data.message || 'SMS campaign processed successfully');
      } else {
        toast.error(data.message || 'Failed to process SMS campaign');
      }
    } catch (error) {
      console.error('Error sending SMS campaign:', error);
      toast.error(error.message || 'Error sending SMS campaign');
    }
  };

  const getCampaigns = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/campaign`, {
        method: 'GET',
        headers: {
          'Authorization': authToken,
        },
      });

      const data = await response.json();
      console.log("Get campaigns response:", data);

      if (response.ok) {
        setCampaigns(data);
      } else {
        toast.error(data.message || 'Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error(error.message || 'Error fetching campaigns');
    }
  };


  return { campaigns, createCampaign, getSMSCharge, confirmAndSendSMS,getCampaigns, smsCharge };
};

export default useCampaigns;
