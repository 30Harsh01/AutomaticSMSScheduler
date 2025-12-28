import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useBilling from '../../hooks/useBilling';

const Credits = () => {
  const [inputValue, setInputValue] = useState('');
  const { credit, getCredit, processPayment } = useBilling();

  useEffect(() => {
    getCredit();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addCredits = async (e) => {
    e.preventDefault();
    const creditToAdd = parseInt(inputValue);

    if (isNaN(creditToAdd) || creditToAdd <= 0) {
      toast.error('Please enter a valid number of credits to add');
      return;
    }

    try {
      await processPayment(creditToAdd); 
      getCredit();
      setInputValue(''); 
    } catch (error) {
      console.error('Error adding credits:', error);
      toast.error('Error adding credits');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 w-full shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Add Credits</h2>
        <form onSubmit={addCredits}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Enter Credits</label>
            <input 
              type="number" 
              value={inputValue} 
              onChange={handleInputChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the number of credits" 
              required
            />
          </div>
          <button 
            type="submit" 
            className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700"
          >
            Add Credit
          </button>
        </form>
        <div className="mt-4">
          <h2 className="font-semibold">Total Credits: {credit}</h2>
        </div>
      </div>
    </div>
  );
};

export default Credits;
