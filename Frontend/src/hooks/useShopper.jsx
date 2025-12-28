import { useState } from 'react';
import toast from 'react-hot-toast';

const useShopper = () => {
  const [shoppers, setShoppers] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = localStorage.getItem('authToken');

  // Add a new shopper
  const addShopper = async (phone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/shopper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      console.log("Add shopper response:", data);

      if (response.ok) {
        toast.success(data.message || 'Shopper added successfully');
      } else {
        toast.error(data.message || 'Failed to add shopper');
      }
    } catch (error) {
      console.error('Error adding shopper:', error);
      toast.error(error.message || 'Error adding shopper');
    }
  };

  // Get shoppers for the logged-in merchant
  const getShoppers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/shopper`, {
        method: 'GET',
        headers: {
          'Authorization': authToken,
        },
      });

      const data = await response.json();
      console.log("Get shoppers response:", data);

      if (response.ok) {
        setShoppers(data);
      } else {
        // toast.error(data.message || 'Failed to fetch shoppers');
      }
    } catch (error) {
      console.error('Error fetching shoppers:', error);
      // toast.error(error.message || 'Error fetching shoppers');
    }
  };

  return { shoppers, addShopper, getShoppers };
};

export default useShopper;
