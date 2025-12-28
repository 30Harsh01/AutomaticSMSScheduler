import { useState } from 'react';
import toast from 'react-hot-toast';

const useSMSCampaign = () => {
  const [smsCharge, setSmsCharge] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = localStorage.getItem('authToken');

  // Fetch SMS charge for a campaign
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
        toast.success(data.message);
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

  return { smsCharge, getSMSCharge, confirmAndSendSMS };
};

export default useSMSCampaign;
