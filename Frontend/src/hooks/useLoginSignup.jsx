import { useState } from 'react';
import toast from 'react-hot-toast';
import {useNavigate, NavLink} from 'react-router-dom'


const useLoginSignup = () => {
  const [merchant, setMerchant] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // console.log(API_BASE_URL)
  const navigate=useNavigate()

  // Register a merchant
  const registerMerchant = async (merchantDetails) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/merchant/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:merchantDetails.name,
          email:merchantDetails.email,
          password:merchantDetails.password
        }),
      });

      const data = await response.json();
      console.log("Register merchant response:", data);

      if (response.ok) {
        toast.success(data.message);
        localStorage.setItem('authToken', data.token);
        setMerchant(data.merchant);
        navigate('/')
      } else {
        toast.error(data.message || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering merchant:', error);
      toast.error(error.message || 'Error registering merchant');
    }
  };

  // Login a merchant
  const loginMerchant = async (email,password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/merchant/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:email,password:password
        }),
      });

      const data = await response.json();
      console.log("Login merchant response:", data);

      if (response.ok) {
        toast.success('Login successful');
        localStorage.setItem('authToken', data.token);
        setMerchant(data.merchant);
        navigate('/')
      } else {
        toast.error(data.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Error logging in merchant:', error);
      toast.error(error.message || 'Error logging in');
    }
  };

  return { merchant, registerMerchant, loginMerchant };
};

export default useLoginSignup;
