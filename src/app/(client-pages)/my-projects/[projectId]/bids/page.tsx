"use client";

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { bidService } from '@/app/services/bidService';
import { BrickLoader } from '@/components/ui/BrickLoader';
import { format } from 'date-fns';
import DefaultPageBanner from '@/components/ui/DefaultPageBanner';
import { Bid } from '@/types/bid'; // Assuming Bid type is defined here
import  { UserState }  from '@/store/userStore'; // Assuming a User type for seller info

// --- New BidCard Component ---
const BidCard = ({ bid }: { bid: Bid & { seller: UserState } }) => {
  const router = useRouter();

  const handleNegotiate = () => {
    router.push(`/negotiation/${bid.id}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-gray-800">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'RWF' }).format(bid.amount)}
          </span>
          <div className="flex items-center">
            <img 
              src={bid.seller?.profilePic || '/default-avatar.png'} 
              alt={bid.seller?.firstName ?? 'Seller avatar'} 
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <span className="font-semibold text-gray-700">{bid.seller?.firstName} {bid.seller?.lastName}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{bid.message || "No message provided."}</p>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">Placed on:</span>
          <span className="font-medium ml-1 text-sm">{bid.createdAt ? format(new Date(bid.createdAt), 'MMM d, yyyy') : 'N/A'}</span>
        </div>
        <button 
          onClick={handleNegotiate}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View & Negotiate
        </button>
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function ProjectBidsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);

  const fetchProjectBids = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) throw new Error('You must be logged in to view bids.');
    return bidService.getProjectBids(projectId, authToken);
  };

  const { data: bids, isLoading, error } = useQuery<any[], Error>({
    queryKey: ['projectBids', projectId],
    queryFn: fetchProjectBids,
    enabled: isClient && !!projectId,
  });

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BrickLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Bids</h2>
        <p className="text-gray-500">{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <DefaultPageBanner title="Project Bids" backgroundImage="/architect.jpg" />
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Bids Received</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Review the bids submitted by various sellers for your project.
          </p>
        </div>

        {bids && bids.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {bids.map((bid) => (
              <BidCard key={bid.id} bid={bid} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg max-w-2xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">No Bids Yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              When a seller places a bid on this project, it will appear here.
            </p>
          </div>
        )}
      </div>
    </>
  );
}