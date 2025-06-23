"use client";

import React from 'react';
import { useBids } from '@/app/hooks/useBids';
import { Bid } from '@/types/bid';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface ProjectBidsListProps {
  projectId: string;
}

const BidCard = ({ bid }: { bid: Bid }) => {
  const router = useRouter();

  const handleNegotiate = () => {
    router.push(`/negotiation/${bid.id}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(bid.amount)}
          </p>
          <div className="text-right">
            <p className="text-sm text-gray-500">Seller: {bid.sellerId}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{bid.message}</p>
        <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Placed on: {new Date(bid.createdAt).toLocaleString()}
            </p>
            <button 
              onClick={handleNegotiate} 
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View & Negotiate
            </button>
          </div>
      </CardContent>
    </Card>
  );
};

export const ProjectBidsList = ({ projectId }: ProjectBidsListProps) => {
  const { useProjectBids } = useBids();
  const { data: bids, isLoading, error } = useProjectBids(projectId);

  if (isLoading) {
    return <div>Loading bids...</div>;
  }

  if (error) {
    return <div>Error loading bids: {(error as Error).message}</div>;
  }

  if (!bids || bids.length === 0) {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold">No Bids Yet</h3>
                <p className="text-gray-500 mt-2">Check back later to see bids from interested sellers.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Bids Received</h2>
        <p className="text-gray-600 mt-2">Review the bids submitted by various sellers for your project.</p>
      </div>
      {bids.map((bid) => (
        <BidCard key={bid.id} bid={bid} />
      ))}
    </div>
  );
}; 