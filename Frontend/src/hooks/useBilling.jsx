import { useState } from 'react';
import toast from 'react-hot-toast';

const useBilling = () => {
  const [billingHistory, setBillingHistory] = useState([]);
  const [credit, setCredit] = useState(0); // State for storing credit balance
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = localStorage.getItem('authToken');

  // Charge the merchant for SMS usage
  const chargeMerchant = async (merchantId, amount) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/billing/charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },
        body: JSON.stringify({ merchantId, amount }),
      });

      const data = await response.json();
      console.log("Charge merchant response:", data);

      if (response.ok) {
        toast.success(data.message || 'Charge successful');
      } else {
        toast.error(data.message || 'Failed to charge');
      }
    } catch (error) {
      console.error('Error charging merchant:', error);
      toast.error(error.message || 'Error processing charge');
    }
  };

  // const processPayment = async (merchantId, amount) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/billing/payment`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': authToken,
  //       },
  //       body: JSON.stringify({ merchantId, amount }),
  //     });

  //     const data = await response.json();
  //     console.log("Payment response:", data);

  //     if (response.ok) {
  //       toast.success(data.message || 'Payment successful');
  //     } else {
  //       toast.error(data.message || 'Payment failed');
  //     }
  //   } catch (error) {
  //     console.error('Error processing payment:', error);
  //     toast.error(error.message || 'Error processing payment');
  //   }
  // };
  const processPayment = async (amount) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/billing/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      console.log("Payment response:", data);

      if (response.ok) {
        setCredit((prevCredit) => prevCredit + Number(amount));
        toast.success(data.message || 'Payment successful');
      } else {
        toast.error(data.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(error.message || 'Error processing payment');
    }
  };


  // Fetch billing history
  const getBillingHistory = async (merchantId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/billing/history/${merchantId}`, {
        method: 'GET',
        headers: {
          'Authorization': authToken,
        },
      });

      const data = await response.json();
      console.log("Billing history response:", data);

      if (response.ok) {
        setBillingHistory(data.billingHistory);
      } else {
        toast.error(data.message || 'Failed to fetch billing history');
      }
    } catch (error) {
      console.error('Error fetching billing history:', error);
      toast.error(error.message || 'Error fetching billing history');
    }
  };

  // Fetch credit balance
  const getCredit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/billing/credit`, {
        method: 'GET',
        headers: {
          'Authorization': authToken,
        },
      });

      const data = await response.json();
      console.log("Credit response:", data);

      if (response.ok) {
        setCredit(data.credit);
      } else {
        // toast.error(data.message || 'Failed to fetch credit balance');
      }
    } catch (error) {
      console.error('Error fetching credit balance:', error);
      toast.error(error.message || 'Error fetching credit balance');
    }
  };

  

  

  return { billingHistory, chargeMerchant, processPayment, getBillingHistory, credit, getCredit,setCredit };
};

export default useBilling;
