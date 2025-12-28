import React, { useState, useEffect } from 'react';
import useCampaigns from '../../hooks/useCampaign';

function GetCampaignsPage() {
    const { campaigns, getCampaigns } = useCampaigns();
    const [showPopup, setShowPopup] = useState(false);
    const [selectedRecipients, setSelectedRecipients] = useState([]);

    useEffect(() => {
        getCampaigns();
    }, []);

    const handleSeeMore = (recipients) => {
        setSelectedRecipients(recipients);
        setShowPopup(true);
    };

    if (campaigns.length == 0) {
        return <h2 className="mx-auto p-6 text-2xl font-bold mb-6">No Campaigns to display</h2>
    }

    return (
        <div className="mx-auto p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">Campaigns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns?.map((campaign) => (
                    <div key={campaign?._id} className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Subject - {campaign?.subject}</h3>
                        {/* <p className="mb-4 text-gray-700">{campaign?.subject}</p> */}

                        <h1 className="text-l font-semibold mb-2">Message</h1>
                        <p className="mb-4 text-gray-700">{campaign?.message}</p>

                        <h3 className="text-l font-semibold mb-2">Recipients</h3>
                        <ul className="list-disc list-inside mb-4">
                            {campaign?.recipients?.slice(0, 2)?.map((recipient) => (
                                <li key={recipient?._id} className="text-gray-600">{recipient?.phone}</li>
                            ))}
                        </ul>

                        {campaign?.recipients?.length > 2 && (
                            <button
                                onClick={() => handleSeeMore(campaign?.recipients)}
                                className="text-blue-500 underline cursor-pointer"
                            >
                                See all recipients
                            </button>
                        )}

                        <p className="text-gray-700">{campaign?.scheduledAt ? new Date(campaign.scheduledAt).toLocaleString() : 'Not Scheduled'}</p>
                        <h3 className="text-xl font-semibold mb-2 mt-4">Status</h3>
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-white ${campaign?.status === 'sent'
                                ? 'bg-green-500'
                                : campaign?.status === 'Pending'
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                        >{campaign?.status}
                        </span>

                        {/* <h3 className="text-xl font-semibold mb-2 mt-4">Scheduled At</h3> */}


                    </div>
                ))}
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">All Recipients</h2>
                        <ul className="list-disc list-inside">
                            {selectedRecipients?.map((recipient) => (
                                <li key={recipient?._id} className="text-gray-700 mb-2">{recipient?.phone}</li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GetCampaignsPage;
