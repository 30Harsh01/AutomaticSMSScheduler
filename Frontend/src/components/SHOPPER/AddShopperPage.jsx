import React, { useState } from 'react';
import toast from 'react-hot-toast';
import useShopper from '../../hooks/useShopper';

function AddShopperPage() {
    const [phone, setPhone] = useState('');
    const { addShopper } = useShopper(); // Using the custom hook

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!phone.trim()) {
            toast.error('Phone number is required');
            return;
        }

        await addShopper(phone); // Call API to add shopper
        setPhone(''); // Reset input field on success
    };

    return (
        <div className="max-w-2xl mx-auto p-6 min-h-[80vh] flex items-center justify-center">
            <div className="bg-white p-8 w-full shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Add Shopper</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                        <input 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter shopper's phone number" 
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700">
                        Add Shopper
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddShopperPage;
