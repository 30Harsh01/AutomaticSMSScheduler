import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import useSMSCampaign from '../../hooks/useSMSCampaign';
import useShopper from '../../hooks/useShopper';
import useCampaigns from '../../hooks/useCampaign';

function CreateSMS() {
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [recipients, setRecipients] = useState([]);
    const [scheduledAt, setScheduledAt] = useState('');
    const { confirmAndSendSMS } = useSMSCampaign();
    const { shoppers, getShoppers } = useShopper();
    const {createCampaign}=useCampaigns()

    useEffect(() => {
        getShoppers(); 
    }, []);

    const shopperOptions = shoppers.map(shopper => ({ value: shopper._id, label: shopper.phone }));
    console.log(shopperOptions)
    const handleSelectAll = () => {
        setRecipients(shopperOptions);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
    
        if (!message.trim()) {
            return toast.error("Message cannot be empty");
        }
    
        if (recipients.length === 0) {
            return toast.error("Please select at least one recipient");
        }
    
        let formattedDate = null;
        if (scheduledAt) {
            formattedDate = new Date(scheduledAt).toISOString().replace("Z", "+00:00");
        }
    
        const campaignData = {
            subject,
            message,
            recipients: recipients.map(recipient => recipient.value), 
            scheduledAt: formattedDate, 
        };
    
        console.log("Submitting campaign:", campaignData);
        
        await createCampaign(campaignData); 
    };
    


    return (
        <div className="max-w-2xl min-h-[80vh] mx-auto p-6 bg-white">
            <h2 className="text-2xl font-bold mb-6">Create SMS</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Subject</label>
                    <input
                        className="w-full p-2 border rounded-lg"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Type your subject here..."
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Message</label>
                    <textarea
                        className="w-full p-2 border rounded-lg"
                        rows="4"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Recipients</label>
                    <Select
                        options={shopperOptions}
                        isMulti
                        value={recipients}
                        onChange={setRecipients}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                    {/* <button
                        type="button"
                        className="mt-2 bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                        onClick={handleSelectAll}
                    >
                        Add All Shoppers
                    </button> */}

<button
    type="button"
    className={`mt-2 px-4 py-2 rounded-lg ${
        shopperOptions.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-300 text-black hover:bg-gray-400"
    }`}
    onClick={handleSelectAll}
    disabled={shopperOptions.length === 0}
>
    {shopperOptions.length === 0 ? "No shoppers attached, please add the shoppers" : "Add All Shoppers"}
</button>



                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Scheduled At</label>
                    <input
                        type="datetime-local"
                        className="w-full p-2 border rounded-lg"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                >
                    Create and Trigger SMS Campaign
                </button>
            </form>
        </div>
    );
}

export default CreateSMS;
