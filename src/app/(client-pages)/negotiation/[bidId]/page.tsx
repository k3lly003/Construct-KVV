"use client";

import React from 'react';
import DefaultPageBanner from '@/app/(components)/DefaultPageBanner';
import { NegotiationChat } from '@/app/dashboard/(components)/negotiation/NegotiationChat';

interface NegotiationPageProps {
  params: Promise<{
    bidId: string;
  }>;
}

export default async function NegotiationPage({ params }: NegotiationPageProps) {
  const { bidId } = await params;

  return (
    <div className="w-full">
      <DefaultPageBanner title="Negotiation" backgroundImage="/building.jpg" />
      <div className="max-w-4xl mx-auto my-10 p-4">
        <NegotiationChat bidId={bidId} />
      </div>
    </div>
  );
}