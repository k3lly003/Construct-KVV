"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useNegotiation } from '@/app/hooks/useNegotiation';
import { useUserStore } from '@/store/userStore';
import { Paperclip, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NegotiationMessage } from '@/types/negotiation';
import { toast } from 'sonner';
import { AcceptBidModal } from './AcceptBidModal';
import { useBids } from '@/app/hooks/useBids';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorBoundary } from 'react-error-boundary';

const BidDetailsCard = ({ bid }: { bid: any }) => {
  if (!bid) return null;

  const formatAmount = (amount: number) => {
    if (isNaN(amount) || amount == null) return 'Amount not available';
    return new Intl.NumberFormat('en-RW', { 
      style: 'currency', 
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date not available';
    return date.toLocaleString();
  };

  return (
    <Card className="mb-4 border-blue-200">
      <CardHeader>
        <CardTitle>Initial Bid Details</CardTitle>
        <CardDescription>This is the starting point of your negotiation.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-2">{formatAmount(bid.amount)}</p>
        {bid.message && <p className="text-gray-700 mb-2">{bid.message}</p>}
        <p className="text-xs text-gray-500 mt-2">
          Bid placed on: {formatDate(bid.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
};

const MessageBubble = ({ msg, isOwnMessage }: { msg: NegotiationMessage, isOwnMessage: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const maxPreviewLength = 200;
  const isLong = msg.message.length > maxPreviewLength;
  const displayMessage = expanded || !isLong ? msg.message : msg.message.slice(0, maxPreviewLength) + '...';

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} w-full`}>
      <div
        className={`relative max-w-[70%] p-3 rounded-lg break-words ${
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-black rounded-bl-none'
        }`}
        style={{ wordBreak: 'break-word' }}
      >
        <p>{displayMessage}</p>
        {isLong && (
          <button
            className="text-xs underline mt-1 text-blue-200 hover:text-white focus:outline-none"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
        {msg.fileUrl && (
          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline mt-2 block">
            View Attachment
          </a>
        )}
        <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

const InitialBidMessage = ({ bid, userId }: { bid: any, userId: string | null }) => {
  if (!bid) return null;
  const [expanded, setExpanded] = useState(false);
  const maxPreviewLength = 200;
  const isLong = bid.message && bid.message.length > maxPreviewLength;
  const displayMessage = expanded || !isLong ? bid.message : bid.message?.slice(0, maxPreviewLength) + '...';
  // Assume initial bid is always from seller, so align left for owner, right for seller
  const isOwnMessage = bid.sellerId === userId;

  const formatAmount = (amount: number) => {
    if (isNaN(amount) || amount == null) return 'Amount not available';
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString();
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 w-full`}>
      <div className={`max-w-[70%] p-3 rounded-lg border-2 border-dashed border-opacity-50 ${isOwnMessage ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}`}
        style={{ wordBreak: 'break-word' }}
      >
        <div className="mb-2">
          <span className="text-xs font-semibold opacity-75">Initial Bid</span>
        </div>
        <p className="font-semibold mb-1">{formatAmount(bid.amount)}</p>
        {displayMessage && <p className="mb-1">{displayMessage}</p>}
        {isLong && (
          <button
            className="text-xs underline mt-1 text-blue-200 hover:text-white focus:outline-none"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
        <p className="text-xs opacity-70 mt-1 text-right">{formatTime(bid.createdAt)}</p>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-2">Loading chat...</span>
  </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="text-red-500 mb-4">
        <p className="font-semibold">Something went wrong</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Separate component for the actual chat content
const ChatContent = ({ 
  bidId, 
  initialBidData, 
  initialMessages 
}: { 
  bidId: string;
  initialBidData?: any;
  initialMessages?: any[];
}) => {
  
  const { useHistory, sendMessage, isSending, isClient: isNegotiationClient } = useNegotiation(bidId, initialMessages);
  const { data: messages, isLoading: isLoadingMessages, error: messagesError } = useHistory();
  
  const { useBidDetails, isClient: isBidsClient } = useBids();
  const { data: bidDetails, isLoading: isLoadingBid, error: bidError } = useBidDetails(bidId, initialBidData);

  const { role: userRole, id: userId, isHydrated } = useUserStore();

  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const isClient = isNegotiationClient && isBidsClient;

  const allMessages = React.useMemo(() => {
    if (!bidDetails || !messages) return [];
    const initialBidMessage = {
      id: `initial-bid-${bidDetails.id}`,
      message: bidDetails.message,
      amount: bidDetails.amount,
      createdAt: bidDetails.createdAt,
      sellerId: bidDetails.sellerId,
      senderType: 'SELLER' as const,
      isInitialBid: true as const
    };
    return [initialBidMessage, ...messages].sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [bidDetails, messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [allMessages]);

  const isCustomer = userRole === 'CUSTOMER';
  const isSeller = userRole === 'SELLER';
  console.log('UserStore Debug:', { userRole, userId, isHydrated });

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;
    if (!isHydrated || !userRole || (!isCustomer && !isSeller)) {
        toast.error("You must be a User or a Seller to send messages.");
        return;
    }

    try {
      await sendMessage({
        bidId,
        message: newMessage,
        senderType: isSeller ? 'SELLER' : 'USER',
        file: file || undefined,
      });
      setNewMessage('');
      setFile(null);
    } catch (e) {
      toast.error('Failed to send message.');
    }
    console.log('handleSendMessage called', { userRole, userId, isHydrated, newMessage });

  };

  if (!isClient) {
    return <LoadingSpinner />;
  }

  const isLoading = isLoadingMessages || isLoadingBid;
  const error = messagesError || bidError;

  // Debug: log bid details
  console.log('bidDetails:', bidDetails);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;

  // Wait for user store hydration before rendering chat input
  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <AcceptBidModal bidId={bidId} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex flex-col border rounded-lg" style={{ height: '70vh', maxHeight: '70vh' }}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Negotiation Chat</h2>
          {isCustomer && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              disabled={!bidDetails}
            >
              Accept Bid
            </button>
          )}
        </div>
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef} style={{ maxHeight: 'calc(70vh - 64px)', minHeight: 0 }}>
          <BidDetailsCard bid={bidDetails} />
          <div className="space-y-4">
            {allMessages?.map((msg) =>
              'isInitialBid' in msg && msg.isInitialBid ? (
                <InitialBidMessage
                  key={msg.id}
                  bid={msg}
                  userId={userId}
                />
              ) : (
                <MessageBubble
                  key={msg.id}
                  msg={msg as NegotiationMessage}
                  isOwnMessage={msg.senderId ? msg.senderId === userId : msg.senderType === userRole}
                />
              )
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isSending}
          />
          <label htmlFor="file-upload" className="cursor-pointer p-2 rounded-md hover:bg-gray-200">
            <Paperclip />
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            disabled={isSending}
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || (!newMessage.trim() && !file)}
            className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Send />
          </button>
        </div>
        {file && (
          <div className="p-2 bg-gray-50 border-t">
            <p className="text-sm">Selected file: {file.name}</p>
            <button
              onClick={() => setFile(null)}
              className="text-xs text-red-500 hover:text-red-700 ml-2"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Main component with error boundary and suspense
export const NegotiationChat = ({ 
  bidId, 
  initialBidData, 
  initialMessages 
}: { 
  bidId: string;
  initialBidData?: any;
  initialMessages?: any[];
}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingSpinner />}>
        <ChatContent 
          bidId={bidId}
          initialBidData={initialBidData}
          initialMessages={initialMessages}
        />
      </Suspense>
    </ErrorBoundary>
  );
};